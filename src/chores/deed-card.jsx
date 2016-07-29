import React, {PropTypes} from 'react';
import {get} from 'lodash';

export const DeedCard = ({deed, isAdmin, approveDeed}) =>
  <article className="deed-card">
    <h1>{get(deed, ['task', 'name'])}</h1>
    <h2>{get(deed, 'value', get(deed, ['task', 'value']))}</h2>
    <h3>{get(deed, ['member', 'displayName'])}</h3>
    {isAdmin &&
      <div className="deed-card__admin">
        <button onClick={() => approveDeed(false)}>Disapprove</button>
        <button onClick={() => approveDeed(true)}>Approve</button>
      </div>
    }
  </article>;

DeedCard.propTypes = {
  deed: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool,
  approveDeed: PropTypes.func.isRequired
};

export default DeedCard;
