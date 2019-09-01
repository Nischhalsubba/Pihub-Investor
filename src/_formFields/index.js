import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Multiselect from 'react-widgets/lib/Multiselect';
import 'react-widgets/dist/css/react-widgets.css';
import Dropzone from 'react-dropzone';

export const inputField = ({
  input,
  label,
  type,
  className,
  id,
  placeholder,
  meta: { error, touched }
}) => {
  return (
    <div>
      <label>{label}</label>
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
  meta: { error, touched }
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
      <label className="form-check-label">
        I agree to the <Link to="/terms"> Terms and Conditions</Link>
      </label>

      <font color="red">{touched && error}</font>
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
  meta: { error, touched }
}) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <Select
        {...input}
        onChange={value => input.onChange(value)}
        onBlur={() => input.onBlur(input.value)}
        options={options}
        className={className}
      />
      <font color="red">{touched && error}</font>
    </div>
  );
};

export const inputSlider = ({
  input,
  label,
  type,
  className,
  id,
  placeholder,
  max,
  min,
  meta: { error, touched }
}) => {
  return (
    <Fragment>
      <div className="col col-10">
        <label className="d-block mincredit-amount mb-5" for="mincredit-amount">
          {label}
        </label>
        <input
          {...input}
          className={className}
          id={id}
          placeholder={placeholder}
          type={type}
          min={min}
          max={max}
          step="1"
          data-orientation="horizontal"
          styles={{ color: 'red' }}
        />
      </div>

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
  meta: { error, touched },
  data,
  valueField,
  textField
}) => {
  return (
    <Fragment>
      <label for="">{label}</label>
      <Multiselect
        {...input}
        onBlur={() => input.onBlur()}
        value={input.value || []}
        data={data}
        valueField={valueField}
        textField={textField}
        className={className}
        id={id}
        placeholder="Select Tags"
      />
      <font color="red">{touched && error}</font>
    </Fragment>
  );
};

export const renderDropzoneField = ({
  input,
  name,
  id,
  meta: { touched, error }
}) => {
  return (
    <Fragment>
      <Dropzone
        onDrop={filesToUpload => {
          input.onChange(filesToUpload);
        }}
        maxSize={8000000}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps() } className="border-dotted">
            <div className="position-relative" id="file_dropzone">
              <div className="dz-message needsclick w-25 position-absolute">
                <img
                  className="d-block m-auto"
                  src="./assets/img/icons/bx-cloud-upload.png"
                  alt=""
                />
                <div className="text-center mt-3">
                  <a className="font-weight-bold">Add file </a>
                  <span>or drop files here</span>
                </div>
              </div>
              <div className="fallback" />
            </div>
            <input {...getInputProps() } />
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
  meta: { error, touched }
}) => {
  return (
    <div>
      <label>{label}</label>
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
