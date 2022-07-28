import UsersService from '../../../services/users';
import { getUsersAction, setUsersPageAction, setUsersStatus } from '../actions';

const getUsersThunk = (page, limit, search, filters) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setUsersStatus('running'));
      const skip = (page - 1) * limit;
      const response = await UsersService.getCustomers(
        skip,
        limit,
        search,
        filters
      );
      await new Promise((res) => {
        setTimeout(() => {
          res();
        }, 1000);
      });
      if (response.status === 200 || response.status === 201) {
        dispatch(setUsersStatus('success'));
        if (page > Math.ceil(response.data.total / limit)) {
          dispatch(setUsersPageAction({ page: 1 }));
        } else {
          dispatch(
            getUsersAction({
              users: response.data.users,
              total: response.data.total,
            })
          );
        }
      }
    } catch (error) {
      dispatch(setUsersStatus('error'));
    }
  };
};

export default getUsersThunk;
