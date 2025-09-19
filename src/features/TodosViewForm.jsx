import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DEBOUNCE_TIME_MS } from '../constants';

const StyledForm = styled.form`
  display: grid;
  gap: 0.5rem;
  padding: 0.25rem 0;
`;

const StyledGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
`;

const TodosViewForm = ({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) => {
  const preventRefresh = (e) => e.preventDefault();
  const [localQueryString, setLocalQueryString] = useState(queryString);

  useEffect(() => {
    setLocalQueryString(queryString);
  }, [queryString]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQueryString(localQueryString);
    }, DEBOUNCE_TIME_MS);
    return () => clearTimeout(timer);
  }, [localQueryString, setQueryString]);

  return (
    <StyledForm onSubmit={preventRefresh}>
      <StyledGroup>
        <label htmlFor="search">Search todos:</label>
        <input
          type="text"
          id="search"
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
        />
        <button type="button" onClick={() => setLocalQueryString('')}>
          Clear
        </button>
      </StyledGroup>

      <StyledGroup>
        <label htmlFor="sortField">Sort by:</label>
        <select
          id="sortField"
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </select>

        <label htmlFor="sortDirection">Direction:</label>
        <select
          id="sortDirection"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </StyledGroup>
    </StyledForm>
  );
};

export default TodosViewForm;
