import { db } from 'fbase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const Tweet = ({ tweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this tweet?');
    if (ok) {
      await deleteDoc(doc(db, `tweets/${tweetObj.id}`));
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewTweet(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(doc(db, `tweets/${tweetObj.id}`), { text: newTweet });
    setEditing(false);
  };

  return (
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              type="text"
              placeholder="Edit your tweet"
              value={newTweet}
              required
              autoFocus
              onChange={onChange}
              className="formInput"
            />
            <input type="submit" value="Update Tweet" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Cancel
          </span>
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>
          {tweetObj.attachmentUrl && <img src={tweetObj.attachmentUrl} />}

          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
