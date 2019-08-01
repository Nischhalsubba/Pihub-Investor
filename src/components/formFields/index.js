import React from 'react';
import { Link } from 'react-router-dom';
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
