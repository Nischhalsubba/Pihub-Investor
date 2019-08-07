import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Multiselect from 'react-widgets/lib/Multiselect';
import 'react-widgets/dist/css/react-widgets.css';

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
  meta: { error, touched }
}) => {
  return (
    <Fragment>
      <div class="col col-10">
        <label className="d-block mincredit-amount mb-5" for="mincredit-amount">
          {label}
        </label>
        <input
          {...input}
          color={'white'}
          className={className}
          id={id}
          placeholder={placeholder}
          type={type}
          min="0"
          max="999999"
          step="1"
          data-orientation="horizontal"
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
