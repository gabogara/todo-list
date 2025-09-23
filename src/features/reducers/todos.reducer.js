export const initialState = {
  todoList: [],
  isLoading: false,
  isSaving: false,
  errorMessage: '',
  sortDirection: 'desc',
  sortField: 'createdTime',
  queryString: '',
};

export const actions = {
  // useEffect (load)
  fetchTodos: 'fetchTodos',
  loadTodos: 'loadTodos',
  setLoadError: 'setLoadError',

  // addTodo (pessimistic)
  startRequest: 'startRequest',
  addTodo: 'addTodo',
  endRequest: 'endRequest',

  // optimistic updates
  updateTodo: 'updateTodo',
  completeTodo: 'completeTodo',
  revertTodo: 'revertTodo',

  // dismiss error
  clearError: 'clearError',
  setSortField: 'setSortField',
  setSortDirection: 'setSortDirection',
  setQueryString: 'setQueryString',
};

export function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.fetchTodos:
      return { ...state, isLoading: true };

    case actions.loadTodos: {
      const mapped = (action.records ?? []).map((record) => ({
        id: record.id,
        title: record.fields?.title ?? '',
        isCompleted: !!record.fields?.isCompleted,
      }));
      return { ...state, todoList: mapped, isLoading: false };
    }

    case actions.setLoadError:
      return {
        ...state,
        errorMessage:
          action.error?.message ??
          (typeof action.error === 'string' ? action.error : 'Unknown error'),
        isLoading: false,
      };

    case actions.startRequest:
      return { ...state, isSaving: true };

    case actions.addTodo: {
      const first = (action.records ?? [])[0];
      const savedTodo = first
        ? {
            id: first.id,
            title: first.fields?.title ?? '',
            isCompleted: !!first.fields?.isCompleted,
          }
        : null;
      return {
        ...state,
        todoList: savedTodo ? [...state.todoList, savedTodo] : state.todoList,
        isSaving: false,
      };
    }

    case actions.endRequest:
      return { ...state, isLoading: false, isSaving: false };

    case actions.revertTodo:
      // make revert use same path as update
      // eslint-disable-next-line no-param-reassign
      action.editedTodo = action.originalTodo;
    // eslint-disable-next-line no-fallthrough
    case actions.updateTodo: {
      const edited = action.editedTodo;
      if (!edited || !edited.id) return state;

      const updatedTodos = state.todoList.map((t) =>
        t.id === edited.id ? { ...t, ...edited } : t
      );

      const updatedState = { ...state, todoList: updatedTodos };
      if (action.error) {
        updatedState.errorMessage =
          action.error?.message ??
          (typeof action.error === 'string' ? action.error : 'Unknown error');
      }
      return updatedState;
    }

    case actions.completeTodo: {
      const id = action.id;
      const updatedTodos = state.todoList.map((t) =>
        t.id === id ? { ...t, isCompleted: true } : t
      );
      const updatedState = { ...state, todoList: updatedTodos };
      if (action.error) {
        updatedState.errorMessage =
          action.error?.message ??
          (typeof action.error === 'string' ? action.error : 'Unknown error');
      }
      return updatedState;
    }

    case actions.clearError:
      return { ...state, errorMessage: '' };

    case actions.setSortField:
      return { ...state, sortField: action.value };
    case actions.setSortDirection:
      return { ...state, sortDirection: action.value };
    case actions.setQueryString:
      return { ...state, queryString: action.value };

    default:
      return state;
  }
}
