import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as ProjectActions from './project';
import * as ActionTypes from '../../../constants';
import { apiClient } from '../../../utils/apiClient';
import { initialTestState } from '../../../testData/testReduxStore';

const mockStore = configureStore([thunk]);

const existingProjectState = {
  ...initialTestState,
  project: {
    ...initialTestState.project,
    id: 'project123',
    owner: { id: initialTestState.user.id }
  }
};

const newProjectState = {
  ...initialTestState,
  project: {
    ...initialTestState.project,
    id: undefined,
    owner: undefined
  }
};

const httpError = (status, data) => ({
  response: { status, data }
});

const expectSaveFailureToast = (actions) => {
  expect(actions).toContainEqual(ProjectActions.startSavingProject());
  expect(actions).toContainEqual(ProjectActions.endSavingProject());
  expect(actions).toContainEqual({
    type: ActionTypes.SET_TOAST_TEXT,
    text: 'Toast.SketchFailedSave'
  });
  expect(actions).toContainEqual({ type: ActionTypes.SHOW_TOAST });
};

describe('saveProject', () => {
  let store;

  afterEach(() => {
    jest.restoreAllMocks();
    if (store) {
      store.clearActions();
    }
  });

  describe('updating an existing project (PUT)', () => {
    it('handles a network error without throwing when error.response is undefined', async () => {
      store = mockStore(existingProjectState);
      jest
        .spyOn(apiClient, 'put')
        .mockRejectedValueOnce(new Error('Network Error'));

      await expect(
        store.dispatch(ProjectActions.saveProject())
      ).resolves.toBeUndefined();

      const actions = store.getActions();
      expectSaveFailureToast(actions);
      expect(actions).toContainEqual(ProjectActions.projectSaveFail(undefined));
      expect(actions).not.toContainEqual(
        expect.objectContaining({ type: ActionTypes.SHOW_ERROR_MODAL })
      );
    });

    it('shows the staleSession modal on 403', async () => {
      store = mockStore(existingProjectState);
      jest
        .spyOn(apiClient, 'put')
        .mockRejectedValueOnce(httpError(403, { error: 'Forbidden' }));

      await store.dispatch(ProjectActions.saveProject());

      const actions = store.getActions();
      expectSaveFailureToast(actions);
      expect(actions).toContainEqual({
        type: ActionTypes.SHOW_ERROR_MODAL,
        modalType: 'staleSession'
      });
      expect(actions).not.toContainEqual(
        expect.objectContaining({ type: ActionTypes.PROJECT_SAVE_FAIL })
      );
    });

    it('shows the staleProject modal on 409', async () => {
      store = mockStore(existingProjectState);
      jest
        .spyOn(apiClient, 'put')
        .mockRejectedValueOnce(httpError(409, { error: 'Conflict' }));

      await store.dispatch(ProjectActions.saveProject());

      const actions = store.getActions();
      expectSaveFailureToast(actions);
      expect(actions).toContainEqual({
        type: ActionTypes.SHOW_ERROR_MODAL,
        modalType: 'staleProject'
      });
      expect(actions).not.toContainEqual(
        expect.objectContaining({ type: ActionTypes.PROJECT_SAVE_FAIL })
      );
    });
  });

  describe('creating a new project (POST)', () => {
    it('handles a network error without throwing when error.response is undefined', async () => {
      store = mockStore(newProjectState);
      jest
        .spyOn(apiClient, 'post')
        .mockRejectedValueOnce(new Error('Network Error'));

      await expect(
        store.dispatch(ProjectActions.saveProject())
      ).resolves.toBeUndefined();

      const actions = store.getActions();
      expectSaveFailureToast(actions);
      expect(actions).toContainEqual(ProjectActions.projectSaveFail(undefined));
      expect(actions).not.toContainEqual(
        expect.objectContaining({ type: ActionTypes.SHOW_ERROR_MODAL })
      );
    });

    it('shows the staleSession modal on 403', async () => {
      store = mockStore(newProjectState);
      jest
        .spyOn(apiClient, 'post')
        .mockRejectedValueOnce(httpError(403, { error: 'Forbidden' }));

      await store.dispatch(ProjectActions.saveProject());

      const actions = store.getActions();
      expectSaveFailureToast(actions);
      expect(actions).toContainEqual({
        type: ActionTypes.SHOW_ERROR_MODAL,
        modalType: 'staleSession'
      });
      expect(actions).not.toContainEqual(
        expect.objectContaining({ type: ActionTypes.PROJECT_SAVE_FAIL })
      );
    });
  });

  describe('changeVisibility', () => {
    it('dispatches SET_PROJECT_VISIBILITY when response contains _id instead of id', async () => {
      store = mockStore(existingProjectState);
      jest.spyOn(apiClient, 'patch').mockResolvedValueOnce({
        status: 200,
        data: {
          _id: 'project123',
          name: 'Zealous sunflower',
          visibility: 'Private',
          updatedAt: '2026-03-01T00:00:00Z'
        }
      });

      await store.dispatch(
        ProjectActions.changeVisibility(
          'project123',
          'Zealous sunflower',
          'Private',
          (key) => key
        )
      );

      const actions = store.getActions();
      expect(actions).toContainEqual({
        type: ActionTypes.SET_PROJECT_VISIBILITY,
        visibility: 'Private',
        updatedAt: '2026-03-01T00:00:00Z'
      });
      expect(actions).toContainEqual({
        type: ActionTypes.SET_PROJECT_NAME,
        name: 'Zealous sunflower'
      });
      expect(actions).toContainEqual({
        type: ActionTypes.SHOW_TOAST
      });
    });

    it('dispatches SET_PROJECT_VISIBILITY when response contains id', async () => {
      store = mockStore(existingProjectState);
      jest.spyOn(apiClient, 'patch').mockResolvedValueOnce({
        status: 200,
        data: {
          id: 'project123',
          name: 'Zealous sunflower',
          visibility: 'Public',
          updatedAt: '2026-03-01T00:00:00Z'
        }
      });

      await store.dispatch(
        ProjectActions.changeVisibility(
          'project123',
          'Zealous sunflower',
          'Public',
          (key) => key
        )
      );

      const actions = store.getActions();
      expect(actions).toContainEqual({
        type: ActionTypes.SET_PROJECT_VISIBILITY,
        visibility: 'Public',
        updatedAt: '2026-03-01T00:00:00Z'
      });
    });

    it('does not dispatch SET_PROJECT_VISIBILITY for a different project', async () => {
      store = mockStore(existingProjectState);
      jest.spyOn(apiClient, 'patch').mockResolvedValueOnce({
        status: 200,
        data: {
          id: 'other-project',
          name: 'Other Sketch',
          visibility: 'Private',
          updatedAt: '2026-03-01T00:00:00Z'
        }
      });

      await store.dispatch(
        ProjectActions.changeVisibility(
          'other-project',
          'Other Sketch',
          'Private',
          (key) => key
        )
      );

      const actions = store.getActions();
      expect(actions).toContainEqual({
        type: ActionTypes.CHANGE_VISIBILITY,
        payload: {
          id: 'other-project',
          visibility: 'Private'
        }
      });
      expect(actions).not.toContainEqual(
        expect.objectContaining({ type: ActionTypes.SET_PROJECT_VISIBILITY })
      );
    });

    it('dispatches ERROR on failure', async () => {
      store = mockStore(existingProjectState);
      jest
        .spyOn(apiClient, 'patch')
        .mockRejectedValueOnce(httpError(500, { message: 'Server error' }));

      await store.dispatch(
        ProjectActions.changeVisibility(
          'project123',
          'Zealous sunflower',
          'Private',
          (key) => key
        )
      );

      const actions = store.getActions();
      expect(actions).toContainEqual({
        type: ActionTypes.ERROR,
        error: { message: 'Server error' }
      });
    });
  });
});
