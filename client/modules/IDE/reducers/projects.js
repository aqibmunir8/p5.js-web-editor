import * as ActionTypes from '../../../constants';

const sketches = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.SET_PROJECTS:
      return action.projects;
    case ActionTypes.DELETE_PROJECT: {
      if (Array.isArray(state)) {
        return state.filter((sketch) => sketch.id !== action.id);
      }
      return {
        ...state,
        projects: (state.projects || []).filter(
          (sketch) => sketch.id !== action.id
        )
      };
    }
    case ActionTypes.CHANGE_VISIBILITY: {
      if (Array.isArray(state)) {
        return state.map((sketch) =>
          sketch.id === action.payload.id
            ? { ...sketch, visibility: action.payload.visibility }
            : sketch
        );
      }
      const updatedProjects = (state.projects || []).map((sketch) =>
        sketch.id === action.payload.id
          ? { ...sketch, visibility: action.payload.visibility }
          : sketch
      );

      return {
        ...state,
        projects: updatedProjects
      };
    }

    case ActionTypes.RENAME_PROJECT: {
      if (Array.isArray(state)) {
        return state.map((sketch) => {
          if (sketch.id === action.payload.id) {
            return { ...sketch, name: action.payload.name };
          }
          return sketch;
        });
      }
      const updatedproject = (state.projects || []).map((sketch) => {
        if (sketch.id === action.payload.id) {
          return { ...sketch, name: action.payload.name };
        }
        return sketch;
      });

      return {
        ...state,
        projects: updatedproject
      };
    }
    default:
      return state;
  }
};

export default sketches;
