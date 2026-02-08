import React, {Fragment} from 'react';
import {Link} from 'react-router-dom';
import Select from 'react-select';
import Multiselect from 'react-widgets/lib/Multiselect';
import 'react-widgets/dist/css/react-widgets.css';
import Dropzone from 'react-dropzone';
import Translate from 'react-translate-component'
import InputRange from 'react-input-range';

export const inputField = ({
                               input,
                               label,
                               type,
                               className,
                               id,
                               placeholder,
                               meta: {error, touched}
                           }) => {
    const fieldId = id || input.name;
    const errorId = `${fieldId}-error`;
    const hasError = touched && error;
    return (
        <div>
            {label ? <label htmlFor={fieldId}><strong>{label}</strong></label>
                : null}
            <input
                {...input}
                type={type}
                color={'white'}
                className={className}
                id={fieldId}
                placeholder={placeholder}
                aria-invalid={hasError ? 'true' : 'false'}
                aria-describedby={hasError ? errorId : undefined}
            />
            {hasError ? <span id={errorId} className="error-text" role="alert">{error}</span> : null}
        </div>
    );
};

export const checkBox = ({
                             input,
                             label,
                             type,
                             className,
                             id,
                             placeholder,
                             meta: {error, touched}
                         }) => {
    const fieldId = id || input.name;
    const errorId = `${fieldId}-error`;
    const hasError = touched && error;
    return (
        <div className="form-check">
            <input
                {...input}
                type={type}
                color={'white'}
                className={className}
                id={fieldId}
                placeholder={placeholder}
                aria-invalid={hasError ? 'true' : 'false'}
                aria-describedby={hasError ? errorId : undefined}
            />
            &nbsp;
            <label className="form-check-label" style={{fontWeight: 100}} htmlFor={fieldId}>
                <Translate content='column.iagree' />
                <Link to="/terms-and-conditions" target="_blank">
                    <Translate content='column.terms' style={{fontWeight: 600}}/>
                </Link>
                <Translate content='placeholder.and'/>
                <a href='https://www.pihub-pi.com/de/datenschutz/' rel="noopener noreferrer" target="_blank">
                    <Translate content='placeholder.privacy_policy' style={{fontWeight: 600}}/>
                </a>
                <Translate content='placeholder.privacy_policy_ending'/>
            </label>
            {hasError ? <p><span id={errorId} className="error-text" role="alert">{error}</span></p> : null}
        </div>
    );
};

export const dropDownField = ({
                                  options,
                                  input,
                                  label,
                                  type,
                                  className,
                                  id,
                                  placeholder,
                                  defaultValue,
                                  meta: {error, touched}
                              }) => {
    const fieldId = id || input.name;
    const errorId = `${fieldId}-error`;
    const hasError = touched && error;
    return (
        <div className="form-group">
            {label ? <label htmlFor={fieldId}><strong>{label}</strong></label>
                : null}
            <Select
                {...input}
                inputId={fieldId}
                onChange={value => input.onChange(value)}
                onBlur={() => input.onBlur(input.value)}
                options={options}
                className={className}
                placeholder={placeholder}
                attributes={{placeholder: 'placeholder.select'}}
                aria-invalid={hasError ? 'true' : 'false'}
                aria-describedby={hasError ? errorId : undefined}
            />
            {hasError ? <span id={errorId} className="error-text" role="alert">{error}</span> : null}
        </div>
    );
};

export const inputSlider = ({
                                step,
                                input,
                                label,
                                type,
                                className,
                                id,
                                placeholder,
                                max,
                                min,
                                meta: {error, touched}
                            }) => {
    const fieldId = id || input.name;
    const errorId = `${fieldId}-error`;
    const hasError = touched && error;
    return (
        <Fragment>
            {/* <div className="form-group"> */}
            <label htmlFor={fieldId}>
                {label}
            </label>
            {/* <div class="d-flex align-items-center"> */}

            <input
                {...input}
                className='range-slider'
                id={fieldId}
                placeholder={placeholder}
                type={type}
                min={min}
                max={max}
                step={step}
                data-orientation="horizontal"
                aria-invalid={hasError ? 'true' : 'false'}
                aria-describedby={hasError ? errorId : undefined}
            />
            {/* </div> */}

            {hasError ? <span id={errorId} className="error-text" role="alert">{error}</span> : null}
        </Fragment>
    );
};

export const renderMultiselect = ({
                                      input,
                                      label,
                                      type,
                                      className,
                                      id,
                                      placeholder,
                                      meta: {error, touched},
                                      data,
                                      valueField,
                                      textField,
                                      defaultValue
                                  }) => {
    const fieldId = id || input.name;
    const errorId = `${fieldId}-error`;
    const hasError = touched && error;
    return (
        <Fragment>
            <label htmlFor={fieldId}><strong>{label}</strong></label>
            <Multiselect
                {...input}
                onBlur={() => input.onBlur()}
                value={input.value[0] === 'Select All' || input.value[0] === 'Alle auswählen' ? data : input.value || []}
                data={data}
                valueField={valueField}
                textField={textField}
                className={className}
                id={fieldId}
                placeholder="Auswählen"
                defaultValue={defaultValue}
                aria-invalid={hasError ? 'true' : 'false'}
                aria-describedby={hasError ? errorId : undefined}
            />
            {hasError ? <span id={errorId} className="error-text" role="alert">{error}</span> : null}
        </Fragment>
    );
};

export const renderDropzoneField = ({
                                        input,
                                        name,
                                        id,
                                        meta: {touched, error}
                                    }) => {
    const fieldId = id || input.name || name;
    const errorId = `${fieldId}-error`;
    const hasError = touched && error;
    return (
        <Fragment>
            <Dropzone
                onDrop={filesToUpload => {
                    input.onChange(filesToUpload);
                }}
                maxSize={8000000}
                multiple
            >
                {({getRootProps, getInputProps}) => (
                    <div
                    {...getRootProps()}
                    className="file-uploader file-uploader--small dropzone">
                    <div className="dz-message">
                        <img src={`${process.env.PUBLIC_URL}/assets/img/icons/bx-cloud-upload.png`} alt="" />
                        <p>
                            {/* <a >Add file </a> */}
                            <Translate
                                content="column.addfile"
                                component="span"
                                className="font-weight-bold mr-1"
                            />
                            {/* <span>or drop files here</span> */}
                            <Translate content="column.ordrop" />
                        </p>
                        <div className="fallback" />
                    </div>
                    <input
                        {...getInputProps()}
                        id={fieldId}
                        aria-invalid={hasError ? 'true' : 'false'}
                        aria-describedby={hasError ? errorId : undefined}
                    />
                </div>
                )}
            </Dropzone>
            {hasError ? <span id={errorId} className="error-text" role="alert">{error}</span> : null}
        </Fragment>
    );
};

export const radioButton = ({
                                input,
                                label,
                                type,
                                className,
                                id,
                                placeholder,
                                meta: {error, touched}
                            }) => {
    return (
        <div>
            <label><strong>{label}</strong></label>
            <input
                {...input}
                type="radio"
                color={'white'}
                className={className}
                id={id}
                placeholder={placeholder}
            />
            <font color="red">{touched && error}</font>
        </div>
    );
};

export const inputDoubleSlider = ({
                                      input,
                                      label,
                                      type,
                                      className,
                                      id,
                                      placeholder,
                                      max,
                                      min,
                                      meta: {error, touched}
                                  }) => {
    return (
        <Fragment>
            {/* <div className="form-group"> */}
            <label>
                {label}
            </label>
            {/* <div class="d-flex align-items-center"> */}

            <div className='demo col-md-9 col-sm-8 col-8'>

                <InputRange
                    maxValue={max}
                    minValue={min}
                    value={{max: max, min: min}}
                    onChange={value => {
                        // input.onChange(value);
                    }}/>
                {/* </div> */}
            </div>

            <font color="red">{touched && error}</font>
        </Fragment>
    );
};


