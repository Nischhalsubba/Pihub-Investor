import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Multiselect from 'react-widgets/lib/Multiselect';
import 'react-widgets/dist/css/react-widgets.css';
import Dropzone from 'react-dropzone';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import InputRange from 'react-input-range';

const getFieldId = (input, id) => id || (input && input.name ? `field-${input.name.replace(/[^a-zA-Z0-9_-]/g, '-')}` : undefined);
const getErrorId = fieldId => fieldId ? `${fieldId}-error` : undefined;
const hasError = meta => Boolean(meta && meta.touched && meta.error);

const FieldError = ({ fieldId, meta }) => {
  if (!hasError(meta)) return null;
  return <span className="field-error" id={getErrorId(fieldId)} role="alert">{String(meta.error)}</span>;
};

const localizedSelectPlaceholder = placeholder => {
  if (typeof placeholder === 'string' && placeholder && placeholder !== 'select' && placeholder !== 'select tags') return placeholder;
  try {
    return counterpart.translate('placeholder.select');
  } catch (error) {
    return 'Select';
  }
};

export const inputField = ({ input, label, type, className, id, placeholder, meta, ...rest }) => {
  const fieldId = getFieldId(input, id);
  const invalid = hasError(meta);
  return (
    <div className="field-control">
      {label ? <label htmlFor={fieldId}><strong>{label}</strong></label> : null}
      <input
        {...input}
        {...rest}
        type={type}
        className={className}
        id={fieldId}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? getErrorId(fieldId) : undefined}
      />
      <FieldError fieldId={fieldId} meta={meta} />
    </div>
  );
};

export const checkBox = ({ input, type, className, id, meta }) => {
  const fieldId = getFieldId(input, id);
  const invalid = hasError(meta);
  return (
    <div className="form-check">
      <input
        {...input}
        type={type}
        className={className}
        id={fieldId}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? getErrorId(fieldId) : undefined}
      />
      <label className="form-check-label" htmlFor={fieldId}>
        <Translate content="column.iagree" />{' '}
        <Link to="/terms-and-conditions" target="_blank" rel="noopener noreferrer"><Translate content="column.terms" /></Link>{' '}
        <Translate content="placeholder.and" />{' '}
        <a href="https://www.pihub-pi.com/de/datenschutz/" rel="noopener noreferrer" target="_blank"><Translate content="placeholder.privacy_policy" /></a>
        <Translate content="placeholder.privacy_policy_ending" />
      </label>
      <FieldError fieldId={fieldId} meta={meta} />
    </div>
  );
};

export const dropDownField = ({ options, input, label, className, id, placeholder, meta }) => {
  const fieldId = getFieldId(input, id);
  const invalid = hasError(meta);
  return (
    <div className="form-group field-control">
      {label ? <label htmlFor={fieldId}><strong>{label}</strong></label> : null}
      <Select
        {...input}
        inputId={fieldId}
        onChange={value => input.onChange(value)}
        onBlur={() => input.onBlur(input.value)}
        options={Array.isArray(options) ? options : []}
        className={className}
        placeholder={localizedSelectPlaceholder(placeholder)}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? getErrorId(fieldId) : undefined}
      />
      <FieldError fieldId={fieldId} meta={meta} />
    </div>
  );
};

export const inputSlider = ({ step, input, label, type, className, id, placeholder, max, min, meta }) => {
  const fieldId = getFieldId(input, id);
  const invalid = hasError(meta);
  return (
    <Fragment>
      {label ? <label htmlFor={fieldId}>{label}</label> : null}
      <input
        {...input}
        className={className || 'range-slider'}
        id={fieldId}
        placeholder={placeholder}
        type={type}
        min={min}
        max={max}
        step={step}
        data-orientation="horizontal"
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? getErrorId(fieldId) : undefined}
      />
      <FieldError fieldId={fieldId} meta={meta} />
    </Fragment>
  );
};

export const renderMultiselect = ({ input, label, className, id, placeholder, meta, data, valueField, textField, defaultValue }) => {
  const fieldId = getFieldId(input, id);
  const invalid = hasError(meta);
  const inputValue = Array.isArray(input.value) ? input.value : [];
  const allSelected = inputValue[0] === 'Select All' || inputValue[0] === 'Alle auswählen';
  return (
    <div className="field-control">
      {label ? <label htmlFor={fieldId}><strong>{label}</strong></label> : null}
      <Multiselect
        {...input}
        onBlur={() => input.onBlur()}
        value={allSelected ? (Array.isArray(data) ? data : []) : inputValue}
        data={Array.isArray(data) ? data : []}
        valueField={valueField}
        textField={textField}
        className={className}
        id={fieldId}
        placeholder={localizedSelectPlaceholder(placeholder)}
        defaultValue={defaultValue}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? getErrorId(fieldId) : undefined}
      />
      <FieldError fieldId={fieldId} meta={meta} />
    </div>
  );
};

export const renderDropzoneField = ({ input, name, id, meta }) => {
  const fieldId = id || name || (input && input.name ? `field-${input.name}` : 'file-upload');
  const invalid = hasError(meta);
  return (
    <Fragment>
      <Dropzone
        onDrop={filesToUpload => input.onChange(filesToUpload)}
        maxSize={8000000}
        multiple
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps({
              className: 'file-uploader file-uploader--small dropzone',
              role: 'button',
              'aria-label': counterpart.translate('label.fileupload'),
              'aria-invalid': invalid || undefined,
              'aria-describedby': invalid ? getErrorId(fieldId) : undefined
            })}
          >
            <div className="dz-message">
              <img src="/assets/img/icons/bx-cloud-upload.png" alt="" />
              <p><strong><Translate content="column.addfile" /></strong> <Translate content="column.ordrop" /></p>
            </div>
            <input {...getInputProps({ id: fieldId })} />
          </div>
        )}
      </Dropzone>
      <FieldError fieldId={fieldId} meta={meta} />
    </Fragment>
  );
};

export const radioButton = ({ input, label, className, meta }) => {
  const valueKey = String(input.value === undefined ? '' : input.value).replace(/[^a-zA-Z0-9_-]/g, '-');
  const fieldId = `${input.name}-${valueKey || 'option'}`;
  const invalid = hasError(meta);
  let accessibleLabel = label;
  if (!accessibleLabel) {
    try {
      accessibleLabel = input.value === 'true' ? counterpart.translate('label.yes') : input.value === 'false' ? counterpart.translate('label.no') : input.value;
    } catch (error) {
      accessibleLabel = input.value;
    }
  }
  return (
    <span className="radio-control">
      <input
        {...input}
        type="radio"
        className={className}
        id={fieldId}
        aria-label={accessibleLabel || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? getErrorId(fieldId) : undefined}
      />
      {label ? <label htmlFor={fieldId}>{label}</label> : null}
      <FieldError fieldId={fieldId} meta={meta} />
    </span>
  );
};

export const inputDoubleSlider = ({ input, label, max, min, meta }) => {
  const value = input.value && typeof input.value === 'object' ? input.value : { max, min };
  return (
    <Fragment>
      {label ? <label>{label}</label> : null}
      <div className="demo col-md-9 col-sm-8 col-8">
        <InputRange maxValue={max} minValue={min} value={value} onChange={nextValue => input.onChange(nextValue)} />
      </div>
      <FieldError meta={meta} />
    </Fragment>
  );
};
