import { useState, useCallback } from "react";
import { request } from "../utils/request";
import { UserType } from '../types';

export type UsersStateType = {
  users: UserType[];
  getUsers: () => Promise<void>;
  getUsersIsLoading: boolean;
  getUsersError: string | null;
  addUser: (userData: UserType) => Promise<void>;
  addUserIsLoading: boolean;
  addUserError: string | null;
  editUser: (userId: string, userData: Partial<UserType>) => Promise<void>;
  editUserIsLoading: boolean;
  editUserError: string | null;
  deleteUsers: (userIds: string[]) => Promise<void>;
  deleteUserIsLoading: boolean;
  deleteUserError: string | null;
};

export const useUsers = (): UsersStateType => {
  const [users, setUsers] = useState([]);

  // getUsers
  const [getUsersIsLoading, setGetUsersIsLoading] = useState(false);
  const [getUsersError, setGetUsersError] = useState(null);

  // addUser
  const [addUserIsLoading, setAddUserIsLoading] = useState(false);
  const [addUserError, setAddUserError] = useState(null);

  // editUser
  const [editUserIsLoading, setEditUserIsLoading] = useState(false);
  const [editUserError, setEditUserError] = useState(null);

  // deleteUser
  const [deleteUserIsLoading, setDeleteUserIsLoading] = useState(false);
  const [deleteUserError, setDeleteUserError] = useState(null);

  const getUsers = useCallback(async () => {
    setGetUsersIsLoading(true);
    try {
      const data = await request({
        url: `${process.env.REACT_APP_API_URL}/users/get-users`,
      });
      setUsers(data);
      setGetUsersError(null);
    } catch (err) {
      setGetUsersError(err);
    } finally {
      setGetUsersIsLoading(false);
    }
  }, []);

  const addUser = async (newUser) => {
    setAddUserIsLoading(true);
    try {
      const data = await request({
        url: `${process.env.REACT_APP_API_URL}/users/create-user`,
        method: "POST",
        body: newUser,
      });
      // Optionally refresh the users list or add directly to state
      setUsers((prev) => [...prev, data]);
      return data;
    } catch (err) {
      setAddUserError(err);
    } finally {
      setAddUserIsLoading(false);
    }
  };

  const editUser = async (editedUser) => {
    setEditUserIsLoading(true);
    try {
      const data = await request({
        url: `${process.env.REACT_APP_API_URL}/users/edit-user`,
        method: "PUT",
        body: editedUser,
      });
      setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
      return data;
    } catch (err) {
      console.error("Error updating user:", err);
      setEditUserError(err);
    } finally {
      setEditUserIsLoading(false);
    }
  };

  const deleteUsers = async (userIds = []) => {
    setDeleteUserIsLoading(true);
    try {
      const response = await request({
        url: `${process.env.REACT_APP_API_URL}/users/delete-users`,
        method: "DELETE",
        body: { ids: userIds },
      });
      const deletedIds = response.ids;
      setUsers((prev) => prev.filter((u) => !deletedIds.includes(u.id)));
      return response;
    } catch (err) {
      setDeleteUserError(err);
    } finally {
      setDeleteUserIsLoading(false);
    }
  };

  return {
    users,
    getUsers,
    getUsersIsLoading,
    getUsersError,
    addUser,
    addUserIsLoading,
    addUserError,
    editUser,
    editUserIsLoading,
    editUserError,
    deleteUsers,
    deleteUserIsLoading,
    deleteUserError,
  };
};
