import React from "react";

const CommentList = ({ comments }) => {
  const renderedComments = comments.map((comment) => {
    let content = '';
    // eslint-disable-next-line default-case
    switch(comment.status){
      case 'Approve':
        content = comment.content
        break;
      case 'Rejected':
        content = 'This comment is rejected';
        break;
      case 'Pending':
        content = 'This comment is in pending '
        break;
    
    }
    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
