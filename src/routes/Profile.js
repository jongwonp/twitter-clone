import { auth, db } from '../fbase';
import { signOut, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';

export default ({ refreshUser, userObj }) => {
  const navigate = useNavigate();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogOutClick = () => {
    signOut(auth);
    navigate('/');
  };
  const getMyTweets = async () => {
    await getDocs(
      query(
        collection(db, 'tweets'),
        where('creatorId', '==', userObj.uid),
        orderBy('createdAt')
      )
    );
  };
  useEffect(() => {
    getMyTweets();
  }, []);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(auth.currentUser, { displayName: newDisplayName });
      refreshUser();
    }
  };
  return (
    <>
      <div className="container">
        <form onSubmit={onSubmit} className="profileForm">
          <input
            onChange={onChange}
            type="text"
            autoFocus
            placeholder="Display name"
            value={newDisplayName}
            className="formInput"
          />
          <input
            type="submit"
            value="Update Profile"
            className="formBtn"
            style={{
              marginTop: 10,
            }}
          />
        </form>
        <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
          Log Out
        </span>
      </div>
    </>
  );
};
