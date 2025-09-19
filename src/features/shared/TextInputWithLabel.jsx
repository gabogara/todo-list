import styled from 'styled-components';

const StyledLabel = styled.label`
  display: inline-block;
  margin-right: 0.5rem;
`;

const StyledInput = styled.input`
  padding: 0.5rem;
`;

function TextInputWithLabel({
  elementId,
  label,
  onChange,
  value,
  inputRef,
  ...rest
}) {
  return (
    <>
      <StyledLabel htmlFor={elementId}>{label}</StyledLabel>
      <StyledInput
        type="text"
        id={elementId}
        ref={inputRef}
        value={value}
        onChange={onChange}
        {...rest}
      />
    </>
  );
}

export default TextInputWithLabel;
