import React, {PropTypes} from 'react';
import {get} from 'lodash';

export const DeedCard = ({deed}) =>
  <article className="deed-card">
    <h1>{get(deed, ['task', 'name'])}</h1>
    <h2>{get(deed, 'value', get(deed, ['task', 'value']))}</h2>
    <h3>{get(deed, ['member', 'displayName'])}</h3>
  </article>;

DeedCard.propTypes = {
  deed: PropTypes.object.isRequired
};

export default DeedCard;
