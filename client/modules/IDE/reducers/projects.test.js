import sketches from './projects';
import * as ActionTypes from '../../../constants';

describe('projects (sketches) reducer', () => {
  it('handles CHANGE_VISIBILITY when state is an array (initial state)', () => {
    const initialState = [
      { id: 'project-1', visibility: 'Public' },
      { id: 'project-2', visibility: 'Public' }
    ];

    const action = {
      type: ActionTypes.CHANGE_VISIBILITY,
      payload: {
        id: 'project-1',
        visibility: 'Private'
      }
    };

    const newState = sketches(initialState, action);
    expect(newState).toEqual([
      { id: 'project-1', visibility: 'Private' },
      { id: 'project-2', visibility: 'Public' }
    ]);
  });

  it('handles CHANGE_VISIBILITY when state is an empty array', () => {
    const initialState = [];
    const action = {
      type: ActionTypes.CHANGE_VISIBILITY,
      payload: {
        id: 'project-1',
        visibility: 'Private'
      }
    };

    const newState = sketches(initialState, action);
    expect(newState).toEqual([]);
  });

  it('handles CHANGE_VISIBILITY when state is an object with projects and metadata', () => {
    const initialState = {
      projects: [
        { id: 'project-1', visibility: 'Public' },
        { id: 'project-2', visibility: 'Public' }
      ],
      metadata: {
        page: 1,
        totalPages: 1,
        totalProjects: 2,
        limit: 10,
        hasPagination: true
      }
    };

    const action = {
      type: ActionTypes.CHANGE_VISIBILITY,
      payload: {
        id: 'project-1',
        visibility: 'Private'
      }
    };

    const newState = sketches(initialState, action);
    expect(newState.projects).toEqual([
      { id: 'project-1', visibility: 'Private' },
      { id: 'project-2', visibility: 'Public' }
    ]);
    expect(newState.metadata).toEqual(initialState.metadata);
  });

  it('handles DELETE_PROJECT when state is an array', () => {
    const initialState = [
      { id: 'project-1', visibility: 'Public' },
      { id: 'project-2', visibility: 'Public' }
    ];

    const action = {
      type: ActionTypes.DELETE_PROJECT,
      id: 'project-1'
    };

    const newState = sketches(initialState, action);
    expect(newState).toEqual([{ id: 'project-2', visibility: 'Public' }]);
  });

  it('handles DELETE_PROJECT when state is an object with projects and metadata', () => {
    const initialState = {
      projects: [
        { id: 'project-1', visibility: 'Public' },
        { id: 'project-2', visibility: 'Public' }
      ],
      metadata: {
        page: 1,
        totalPages: 1,
        totalProjects: 2,
        limit: 10,
        hasPagination: true
      }
    };

    const action = {
      type: ActionTypes.DELETE_PROJECT,
      id: 'project-1'
    };

    const newState = sketches(initialState, action);
    expect(newState.projects).toEqual([
      { id: 'project-2', visibility: 'Public' }
    ]);
    expect(newState.metadata).toEqual(initialState.metadata);
  });

  it('handles RENAME_PROJECT when state is an array', () => {
    const initialState = [{ id: 'project-1', name: 'Old Name' }];

    const action = {
      type: ActionTypes.RENAME_PROJECT,
      payload: {
        id: 'project-1',
        name: 'New Name'
      }
    };

    const newState = sketches(initialState, action);
    expect(newState).toEqual([{ id: 'project-1', name: 'New Name' }]);
  });

  it('handles RENAME_PROJECT when state is an object with projects and metadata', () => {
    const initialState = {
      projects: [{ id: 'project-1', name: 'Old Name' }],
      metadata: { page: 1 }
    };

    const action = {
      type: ActionTypes.RENAME_PROJECT,
      payload: {
        id: 'project-1',
        name: 'New Name'
      }
    };

    const newState = sketches(initialState, action);
    expect(newState.projects).toEqual([{ id: 'project-1', name: 'New Name' }]);
    expect(newState.metadata).toEqual({ page: 1 });
  });
});
