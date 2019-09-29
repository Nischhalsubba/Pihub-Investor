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
    return (
        <div>
            {label ? <label><strong>{label}</strong></label>
                : null}
            <input
                {...input}
                type={type}
                color={'white'}
                className={className}
                id={id}
                placeholder={placeholder}
            />
            <font color="red">{touched && error}</font>
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
    return (
        <div className="form-check">
            <input
                {...input}
                type={type}
                color={'white'}
                className={className}
                id={id}
                placeholder={placeholder}
            />
            &nbsp; &nbsp; &nbsp;
            <label className="form-check-label" style={{fontWeight: 100}}>
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
            <p>
                <font color="red">{touched && error}</font>
            </p>
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
    return (
        <div className="form-group">
            {label ? <label><strong>{label}</strong></label>
                : null}
            <Select
                {...input}
                onChange={value => input.onChange(value)}
                onBlur={() => input.onBlur(input.value)}
                options={options}
                className={className}
                placeholder={placeholder}
                attributes={{placeholder: 'placeholder.select'}}
            />
            <font color="red">{touched && error}</font>
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
    return (
        <Fragment>
            {/* <div className="form-group"> */}
            <label>
                {label}
            </label>
            {/* <div class="d-flex align-items-center"> */}

            <div className='demo col-md-9 col-sm-8 col-8'>

                <input
                    {...input}
                    className='position-relative w-100'
                    id={id}
                    placeholder={placeholder}
                    type={type}
                    min={min}
                    max={max}
                    step={step}
                    data-orientation="horizontal"
                />
            </div>
            {/* </div> */}

            <font color="red">{touched && error}</font>
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
    return (
        <Fragment>
            <label for=""><strong>{label}</strong></label>
            <Multiselect
                {...input}
                onBlur={() => input.onBlur()}
                value={input.value[0] === 'Select All' ? data : input.value || []}
                data={data}
                valueField={valueField}
                textField={textField}
                className={className}
                id={id}
                placeholder="Auswählen"
                defaultValue={defaultValue}
            />
            <font color="red">{touched && error}</font>
        </Fragment>
    );
};

export const renderDropzoneField = ({
                                        input,
                                        name,
                                        id,
                                        meta: {touched, error}
                                    }) => {
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
                    <div {...getRootProps()} className="border-dotted">
                        <div className="position-relative" id="file_dropzone">
                            <div className="dz-message needsclick w-25 position-absolute">
                                <img
                                    className="d-block m-auto"
                                    src="./assets/img/icons/bx-cloud-upload.png"
                                    alt=""
                                />
                                <div className="text-center mt-3">
                                    {/* <a className="font-weight-bold">Add file </a> */}
                                    <Translate content='column.addfile' component="a"
                                               className="font-weight-bold mr-1"/>
                                    {/* <span>or drop files here</span> */}
                                    <Translate content='column.ordrop'/>
                                </div>
                            </div>
                            <div className="fallback"/>
                        </div>
                        <input {...getInputProps()} />
                    </div>
                )}
            </Dropzone>
            <font color="red">{touched && error}</font>
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
                        console.log(value)
                        // input.onChange(value);
                    }}/>
                {/* </div> */}
            </div>

            <font color="red">{touched && error}</font>
        </Fragment>
    );
};