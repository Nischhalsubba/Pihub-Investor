import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Prompt } from 'react-router-dom';
import Select from 'react-select';
import { getIndustryList } from '../../actions/industry';
import { getServiceList } from '../../actions/service';
import { getAllState, getCounties } from '../../actions/statesCounties';
import { validateOpportunity } from '../../_utils/opportunityValidation';
import { isDemoMode } from '../../_utils/demoMode';
import { showToast } from '../../_utils/workspaceEvents';

const Translator = require('react-translate-component');

const CREDIT_AGENCIES = [
  { id: 1, name: 'Creditreform' },
  { id: 2, name: 'Fitch' },
  { id: 3, name: "Moody's" },
  { id: 4, name: 'Euler Hermes' },
  { id: 5, name: 'Standard & Poors' },
  { id: 6, name: 'Bank/Other' }
];

const FILE_ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg';
const MAX_FILE_BYTES = 8 * 1024 * 1024;

const localized = value => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  const locale = Translator.getLocale();
  if (value.name !== undefined) return localized(value.name);
  return value[locale] || value.en || value.de || value.label || value.title || '';
};

const ids = values => (Array.isArray(values) ? values : []).map(value => {
  if (value && typeof value === 'object') return value.id !== undefined ? value.id : value.value;
  return value;
}).filter(value => value !== undefined && value !== null && value !== '' && Number(value) !== 0);

const unique = values => Array.from(new Set(ids(values).map(String))).map(value => {
  const numeric = Number(value);
  return Number.isNaN(numeric) ? value : numeric;
});

const optionize = list => (Array.isArray(list) ? list : [])
  .filter(item => item && Number(item.id) !== 0)
  .map(item => ({ value: item.id, label: localized(item) }));

const optionValues = (options, selected) => {
  const wanted = new Set((Array.isArray(selected) ? selected : []).map(String));
  return options.filter(option => wanted.has(String(option.value)));
};

const money = value => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return '—';
  return new Intl.NumberFormat(Translator.getLocale() === 'de' ? 'de-DE' : 'en-IE', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0
  }).format(amount);
};

const formatSavedAt = value => {
  const date = new Date(Number(value));
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(date);
};

const getInitialForm = source => {
  const initial = source && typeof source === 'object' ? source : {};
  const existingRatings = Array.isArray(initial.ratings) ? initial.ratings : [];
  const ratingValues = {};
  existingRatings.forEach(rating => {
    const agency = CREDIT_AGENCIES.find(item => String(item.id) === String(rating.rating_id || rating.id)
      || item.name.toLowerCase() === String(rating.name || '').toLowerCase());
    if (agency) ratingValues[agency.id] = rating.value || '';
  });

  const service = Array.isArray(initial.services) ? initial.services[0] : initial.services;
  const serviceId = initial.service_id || (service && (service.value || service.id)) || (initial.service && initial.service.id) || '';
  const collateral = initial.colatoral !== undefined ? initial.colatoral : initial.collatoral;
  const hasRatings = existingRatings.length > 0 || initial.rating_for_credit === 1 || initial.rating_for_credit === true;

  return {
    product_title: localized(initial.product_title) || '',
    state_ids: unique(initial.state_ids || initial.states),
    county_ids: unique(initial.county_ids || initial.counties || initial.County),
    industry_id: unique(initial.industry_ids || initial.industry_id || initial.industries),
    service_id: serviceId,
    min_time_duration: initial.min_time_duration !== undefined ? initial.min_time_duration : 12,
    max_time_duration: initial.max_time_duration !== undefined ? initial.max_time_duration : 24,
    min_credit_amount: initial.min_credit_amount !== undefined ? initial.min_credit_amount : 250000,
    max_credit_amount: initial.max_credit_amount !== undefined ? initial.max_credit_amount : 500000,
    min_sales_creditor: initial.min_sales_creditor !== undefined ? initial.min_sales_creditor : 0,
    colatoral: collateral === 1 || collateral === true || collateral === 'true' ? 'true' : collateral === 0 || collateral === false || collateral === 'false' ? 'false' : '',
    credit: hasRatings ? 'true' : initial.rating_for_credit === 0 || initial.rating_for_credit === false ? 'false' : '',
    ratingValues,
    files: []
  };
};

class OpportunityForm extends Component {
  constructor(props) {
    super(props);
    const initial = getInitialForm(props.initialValues);
    const draft = this.readDraft();
    this.state = {
      ...initial,
      ...(draft && draft.form ? draft.form : {}),
      files: [],
      errors: {},
      dirty: Boolean(draft),
      reviewMode: false,
      isSubmitting: false,
      uploadProgress: 0,
      draftSavedAt: draft && draft.savedAt ? draft.savedAt : null,
      statusMessage: draft ? `Draft restored from this browser${draft.savedAt ? ` · saved ${formatSavedAt(draft.savedAt)}` : ''}.` : ''
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.props.getAllState();
    this.props.getIndustryList();
    this.props.getServiceList();
    if (this.state.state_ids.length) this.props.getCounties(this.state.state_ids);
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.state_ids !== this.state.state_ids && this.state.state_ids.length) this.props.getCounties(this.state.state_ids);
    if (this.draftSnapshot(prevState) !== this.draftSnapshot(this.state) && this.state.dirty) {
      window.clearTimeout(this.draftTimer);
      this.draftTimer = window.setTimeout(this.persistDraft, 450);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    window.clearTimeout(this.draftTimer);
  }

  draftKey = () => `pihub-opportunity-draft:${this.props.mode}:${this.props.productId || 'new'}`;
  draftStorage = () => isDemoMode() ? localStorage : sessionStorage;

  readDraft = () => {
    try {
      const storage = this.draftStorage();
      let value = storage.getItem(this.draftKey());
      if (!value && isDemoMode()) {
        const legacy = sessionStorage.getItem(this.draftKey());
        if (legacy) { value = legacy; storage.setItem(this.draftKey(), legacy); sessionStorage.removeItem(this.draftKey()); }
      }
      return value ? JSON.parse(value) : null;
    } catch (error) {
      return null;
    }
  };

  draftSnapshot = state => JSON.stringify({
    product_title: state.product_title,
    state_ids: state.state_ids,
    county_ids: state.county_ids,
    industry_id: state.industry_id,
    service_id: state.service_id,
    min_time_duration: state.min_time_duration,
    max_time_duration: state.max_time_duration,
    min_credit_amount: state.min_credit_amount,
    max_credit_amount: state.max_credit_amount,
    min_sales_creditor: state.min_sales_creditor,
    colatoral: state.colatoral,
    credit: state.credit,
    ratingValues: state.ratingValues
  });

  persistDraft = () => {
    try {
      const savedAt = Date.now();
      this.draftStorage().setItem(this.draftKey(), JSON.stringify({ form: JSON.parse(this.draftSnapshot(this.state)), savedAt }));
      if (this.mounted) this.setState({ draftSavedAt: savedAt });
    } catch (error) {
      // Draft persistence must never block the actual form workflow.
    }
  };

  clearDraft = () => {
    try { localStorage.removeItem(this.draftKey()); } catch (error) { /* no-op */ }
    try { sessionStorage.removeItem(this.draftKey()); } catch (error) { /* no-op */ }
  };

  discardDraft = () => {
    this.clearDraft();
    this.setState({ ...getInitialForm(this.props.initialValues), files: [], errors: {}, dirty: false, reviewMode: false, draftSavedAt: null, statusMessage: 'Draft discarded.' });
    showToast('The local opportunity draft was discarded.', { title: 'Draft removed' });
  };

  handleBeforeUnload = event => {
    if (!this.state.dirty || this.state.isSubmitting) return;
    event.preventDefault();
    event.returnValue = '';
  };

  update = (field, value) => this.setState(prev => ({ [field]: value, dirty: true, reviewMode: false, statusMessage: '', errors: { ...prev.errors, [field]: undefined } }));

  updateStates = values => {
    this.setState(prev => ({ state_ids: values, county_ids: [], dirty: true, reviewMode: false, statusMessage: '', errors: { ...prev.errors, state_ids: undefined, county_ids: undefined } }));
    if (!values.length) this.props.getCounties([]);
  };

  updateRating = (id, value) => this.setState(prev => ({ ratingValues: { ...prev.ratingValues, [id]: value }, dirty: true, reviewMode: false, statusMessage: '' }));

  validate = () => { const errors = validateOpportunity(this.state); this.setState({ errors }); return errors; };

  focusFirstError = errors => {
    const first = Object.keys(errors)[0];
    if (!first) return;
    const id = first === 'ratings' ? 'opportunity-rating-1' : `opportunity-${first}`;
    const node = document.getElementById(id);
    if (node && node.focus) node.focus();
  };

  handleFiles = event => {
    const incoming = Array.from(event.target.files || []);
    const oversized = incoming.find(file => file.size > MAX_FILE_BYTES);
    if (oversized) {
      this.setState(prev => ({ errors: { ...prev.errors, files: `${oversized.name} is larger than the 8 MB per-file limit.` } }));
      event.target.value = '';
      return;
    }
    this.setState(prev => ({ files: incoming, dirty: true, errors: { ...prev.errors, files: undefined } }));
  };

  buildPayload = () => {
    const ratings = CREDIT_AGENCIES.map(agency => ({ rating_id: agency.id, value: String(this.state.ratingValues[agency.id] || '').trim() })).filter(rating => rating.value);
    return {
      product_title: this.state.product_title.trim(), state_ids: this.state.state_ids, county_ids: this.state.county_ids, industry_id: this.state.industry_id,
      services: { value: this.state.service_id }, min_time_duration: Number(this.state.min_time_duration), max_time_duration: Number(this.state.max_time_duration),
      min_duration: Number(this.state.min_time_duration), max_duration: Number(this.state.max_time_duration), min_credit_amount: Number(this.state.min_credit_amount),
      max_credit_amount: Number(this.state.max_credit_amount), min_sales_creditor: Number(this.state.min_sales_creditor), colatoral: this.state.colatoral,
      credit: this.state.credit, ratings, files: this.state.files
    };
  };

  handleReview = () => {
    const errors = this.validate();
    if (Object.keys(errors).length) { this.focusFirstError(errors); return; }
    this.persistDraft();
    this.setState({ reviewMode: true, statusMessage: 'Review the summary, then confirm when the data is correct.' });
  };

  handleSaveDraft = () => {
    this.persistDraft();
    this.setState({ statusMessage: isDemoMode() ? 'Draft saved locally in this browser.' : 'Draft saved for this browser session.' });
    showToast('Your opportunity draft is saved.', { type: 'success', title: 'Draft saved' });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const errors = this.validate();
    if (Object.keys(errors).length) { this.focusFirstError(errors); return; }
    this.setState({ isSubmitting: true, uploadProgress: 0, statusMessage: 'Saving opportunity…' });
    const result = await this.props.onCommit(this.buildPayload(), progress => { if (this.mounted) this.setState({ uploadProgress: progress }); });
    if (!this.mounted) return;
    if (result === false) {
      this.setState({ isSubmitting: false, statusMessage: 'Save failed. Your draft is still available in this browser.' });
      return;
    }
    this.clearDraft();
    this.setState({ dirty: false, isSubmitting: false, draftSavedAt: null, statusMessage: 'Saved.' });
    showToast('Opportunity saved successfully.', { type: 'success', title: 'Saved' });
  };

  renderError = field => this.state.errors[field] ? <span className="field-error" id={`opportunity-${field}-error`} role="alert">{this.state.errors[field]}</span> : null;

  render() {
    const isEdit = this.props.mode === 'edit';
    const locale = Translator.getLocale();
    const stateOptions = optionize(this.props.allStates && this.props.allStates.all);
    const countyOptions = optionize(this.props.county && this.props.county.list);
    const industryOptions = optionize(this.props.industry && this.props.industry.list);
    const serviceOptions = this.props.service && Array.isArray(this.props.service[locale]) ? this.props.service[locale] : [];
    const errorCount = Object.keys(this.state.errors).filter(key => this.state.errors[key]).length;
    const cancelTo = isEdit && this.props.productId ? `/opportunities/${encodeURIComponent(this.props.productId)}` : '/products';

    return (
      <form className="profile-edit-form opportunity-form" onSubmit={this.handleSubmit} noValidate>
        <Prompt when={this.state.dirty && !this.state.isSubmitting} message="You have unsaved opportunity changes. Leave this page?" />
        <div className="form-intro-note"><strong>Complete underwriting inputs precisely.</strong><span>Fields marked * are required. Exact financial values are entered directly instead of approximated with sliders.</span></div>
        {errorCount ? <div className="auth-error form-error-summary" role="alert" aria-live="assertive"><strong>{errorCount} field{errorCount === 1 ? '' : 's'} need attention.</strong><span>Review the inline messages below. Focus has moved to the first invalid field.</span></div> : null}

        <section className="profile-edit-section opportunity-form-section" aria-labelledby="opportunity-basics-title"><div className="profile-edit-section-head"><div><h2 id="opportunity-basics-title">Opportunity basics</h2><p>Identity, facility and geographic scope.</p></div></div><div className="profile-edit-grid">
          <div className="profile-edit-field profile-edit-field-wide"><label htmlFor="opportunity-product_title">Opportunity title *</label><input id="opportunity-product_title" className="form-control" value={this.state.product_title} onChange={event => this.update('product_title', event.target.value)} aria-invalid={Boolean(this.state.errors.product_title)} aria-describedby={this.state.errors.product_title ? 'opportunity-product_title-error' : undefined} />{this.renderError('product_title')}</div>
          <div className="profile-edit-field"><label htmlFor="opportunity-service_id">Facility type *</label><Select inputId="opportunity-service_id" options={serviceOptions} value={serviceOptions.find(option => String(option.value) === String(this.state.service_id)) || null} onChange={option => this.update('service_id', option ? option.value : '')} placeholder="Select a facility" />{this.renderError('service_id')}</div>
          <div className="profile-edit-field"><label htmlFor="opportunity-state_ids">States *</label><Select inputId="opportunity-state_ids" isMulti options={stateOptions} value={optionValues(stateOptions, this.state.state_ids)} onChange={options => this.updateStates(unique((options || []).map(option => option.value)))} placeholder="Select states" />{this.renderError('state_ids')}</div>
          <div className="profile-edit-field"><label htmlFor="opportunity-county_ids">Counties *</label><Select inputId="opportunity-county_ids" isMulti options={countyOptions} value={optionValues(countyOptions, this.state.county_ids)} onChange={options => this.update('county_ids', unique((options || []).map(option => option.value)))} placeholder={this.state.state_ids.length ? 'Select counties' : 'Select states first'} isDisabled={!this.state.state_ids.length} />{this.renderError('county_ids')}</div>
          <div className="profile-edit-field"><label htmlFor="opportunity-industry_id">Industries *</label><Select inputId="opportunity-industry_id" isMulti options={industryOptions} value={optionValues(industryOptions, this.state.industry_id)} onChange={options => this.update('industry_id', unique((options || []).map(option => option.value)))} placeholder="Select industries" />{this.renderError('industry_id')}</div>
        </div></section>

        <section className="profile-edit-section opportunity-form-section" aria-labelledby="opportunity-credit-title"><div className="profile-edit-section-head"><div><h2 id="opportunity-credit-title">Credit parameters</h2><p>Use exact values so the opportunity can be compared and screened reliably.</p></div></div><div className="profile-edit-grid">
          <div className="profile-edit-field"><label htmlFor="opportunity-min_time_duration">Minimum tenor (months) *</label><input id="opportunity-min_time_duration" className="form-control" type="number" min="1" step="1" inputMode="numeric" value={this.state.min_time_duration} onChange={event => this.update('min_time_duration', event.target.value)} />{this.renderError('min_time_duration')}</div>
          <div className="profile-edit-field"><label htmlFor="opportunity-max_time_duration">Maximum tenor (months) *</label><input id="opportunity-max_time_duration" className="form-control" type="number" min="1" step="1" inputMode="numeric" value={this.state.max_time_duration} onChange={event => this.update('max_time_duration', event.target.value)} />{this.renderError('max_time_duration')}</div>
          <div className="profile-edit-field"><label htmlFor="opportunity-min_credit_amount">Minimum credit (EUR) *</label><input id="opportunity-min_credit_amount" className="form-control" type="number" min="1" step="1000" inputMode="decimal" value={this.state.min_credit_amount} onChange={event => this.update('min_credit_amount', event.target.value)} /><span className="profile-edit-helper">Current value: {money(this.state.min_credit_amount)}</span>{this.renderError('min_credit_amount')}</div>
          <div className="profile-edit-field"><label htmlFor="opportunity-max_credit_amount">Maximum credit (EUR) *</label><input id="opportunity-max_credit_amount" className="form-control" type="number" min="1" step="1000" inputMode="decimal" value={this.state.max_credit_amount} onChange={event => this.update('max_credit_amount', event.target.value)} /><span className="profile-edit-helper">Current value: {money(this.state.max_credit_amount)}</span>{this.renderError('max_credit_amount')}</div>
          <div className="profile-edit-field profile-edit-field-wide"><label htmlFor="opportunity-min_sales_creditor">Minimum creditor sales (EUR) *</label><input id="opportunity-min_sales_creditor" className="form-control" type="number" min="0" step="1000" inputMode="decimal" value={this.state.min_sales_creditor} onChange={event => this.update('min_sales_creditor', event.target.value)} /><span className="profile-edit-helper">Current value: {money(this.state.min_sales_creditor)}</span>{this.renderError('min_sales_creditor')}</div>
        </div></section>

        <section className="profile-edit-section opportunity-form-section" aria-labelledby="opportunity-risk-title"><div className="profile-edit-section-head"><div><h2 id="opportunity-risk-title">Risk requirements</h2><p>Collateral and external rating requirements used during screening.</p></div></div><div className="profile-edit-grid">
          <fieldset className="profile-edit-field form-choice-group" id="opportunity-colatoral"><legend>Collateral required *</legend><label><input type="radio" name="opportunity-collateral" value="true" checked={this.state.colatoral === 'true'} onChange={event => this.update('colatoral', event.target.value)} /> Yes</label><label><input type="radio" name="opportunity-collateral" value="false" checked={this.state.colatoral === 'false'} onChange={event => this.update('colatoral', event.target.value)} /> No</label>{this.renderError('colatoral')}</fieldset>
          <fieldset className="profile-edit-field form-choice-group" id="opportunity-credit"><legend>Credit rating required *</legend><label><input type="radio" name="opportunity-credit-rating" value="true" checked={this.state.credit === 'true'} onChange={event => this.update('credit', event.target.value)} /> Yes</label><label><input type="radio" name="opportunity-credit-rating" value="false" checked={this.state.credit === 'false'} onChange={event => this.update('credit', event.target.value)} /> No</label>{this.renderError('credit')}</fieldset>
          {this.state.credit === 'true' ? <div className="profile-edit-field profile-edit-field-wide rating-entry-grid" id="opportunity-ratings"><strong>Agency ratings *</strong><span className="profile-edit-helper">Enter only ratings that apply. At least one agency value is required.</span>{CREDIT_AGENCIES.map(agency => <label className="rating-entry-row" key={agency.id} htmlFor={`opportunity-rating-${agency.id}`}><span>{agency.name}</span><input id={`opportunity-rating-${agency.id}`} className="form-control" value={this.state.ratingValues[agency.id] || ''} onChange={event => this.updateRating(agency.id, event.target.value)} placeholder="e.g. BBB+" /></label>)}{this.renderError('ratings')}</div> : null}
        </div></section>

        <section className="profile-edit-section opportunity-form-section" aria-labelledby="opportunity-evidence-title"><div className="profile-edit-section-head"><div><h2 id="opportunity-evidence-title">Evidence and documents</h2><p>Attach only material needed to evaluate this opportunity.</p></div></div><div className="profile-edit-grid"><div className="profile-edit-field profile-edit-field-wide"><label htmlFor="opportunity-files">Files <span className="optional-label">Optional</span></label><input id="opportunity-files" className="form-control" type="file" multiple accept={FILE_ACCEPT} onChange={this.handleFiles} /><span className="profile-edit-helper">PDF, Office documents and common images. Maximum 8 MB per file. Files are transmitted only when you submit the form. Do not upload secrets or documents unrelated to the investment review.</span>{this.state.files.length ? <div className="selected-files" aria-live="polite">{this.state.files.map(file => <span key={`${file.name}-${file.lastModified}`}>{file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB</span>)}</div> : null}{this.renderError('files')}{this.state.isSubmitting && this.state.files.length ? <progress className="upload-progress" max="100" value={this.state.uploadProgress}>{this.state.uploadProgress}%</progress> : null}</div></div></section>

        {this.state.reviewMode ? <section className="profile-edit-section opportunity-review" aria-labelledby="opportunity-review-title"><div className="profile-edit-section-head"><div><h2 id="opportunity-review-title">Review before saving</h2><p>Confirm the values that drive screening and capital decisions.</p></div></div><div className="detail-grid"><div className="detail-item"><span>Opportunity</span><strong>{this.state.product_title}</strong></div><div className="detail-item"><span>Credit band</span><strong>{money(this.state.min_credit_amount)} – {money(this.state.max_credit_amount)}</strong></div><div className="detail-item"><span>Tenor</span><strong>{this.state.min_time_duration}–{this.state.max_time_duration} months</strong></div><div className="detail-item"><span>Minimum sales</span><strong>{money(this.state.min_sales_creditor)}</strong></div><div className="detail-item"><span>Collateral</span><strong>{this.state.colatoral === 'true' ? 'Required' : 'Not required'}</strong></div><div className="detail-item"><span>External rating</span><strong>{this.state.credit === 'true' ? 'Required' : 'Not required'}</strong></div></div></section> : null}

        <div className="profile-edit-actions opportunity-form-actions"><div className="ap-draft-tools"><div className="form-action-status" role="status" aria-live="polite">{this.state.statusMessage}</div>{this.state.draftSavedAt ? <span className="ap-autosave-status"><i className="bx bx-cloud-upload" aria-hidden="true" />Autosaved {formatSavedAt(this.state.draftSavedAt)}</span> : null}</div><Link className="btn btn-link" to={cancelTo}>Cancel</Link>{this.state.draftSavedAt ? <button className="btn btn-link" type="button" onClick={this.discardDraft} disabled={this.state.isSubmitting}>Discard draft</button> : null}<button className="btn btn-secondary" type="button" onClick={this.handleSaveDraft} disabled={this.state.isSubmitting}>Save draft</button><button className="btn btn-secondary" type="button" onClick={this.handleReview} disabled={this.state.isSubmitting}>Review</button><button className="btn btn-primary" type="submit" disabled={this.state.isSubmitting}>{this.state.isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Publish opportunity'}</button></div>
      </form>
    );
  }
}

export default connect(
  state => ({ industry: state.industryList, service: state.service, allStates: state.allStates, county: state.county, language: state.language }),
  { getIndustryList, getServiceList, getAllState, getCounties }
)(OpportunityForm);
