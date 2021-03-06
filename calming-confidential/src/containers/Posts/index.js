
import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
// import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar/index.js'

var ReactFitText = require('react-fittext');

class Posts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      single_comment: '',
    }
  }

  handleUpvote = (post, key) => {
    this.props.firebase.ref('posts/' + key).set({
      title: post.title,
      upvote: post.upvote + 1,
      downvote: post.downvote,
      content: post.content,
      comments: post.comments,
      num_comments: post.num_comments
    });
  }

  handleDownvote = (post, key) => {
    this.props.firebase.ref('posts/' + key).set({
      title: post.title,
      upvote: post.upvote,
      downvote: post.downvote + 1,
      content: post.content
    });
  }

  handleComment = (post, key) => {
    let x = this.state.single_comment;
    if(x == ""){
      return;
    }
    this.props.firebase.ref('posts/' + key).set({
      title: post.title,
      upvote: post.upvote,
      downvote: post.downvote,
      content: post.content,
      comments: post.comments.concat(this.state.single_comment),
      num_comments: post.num_comments + 1
    });
    this.setState({
      single_comment: ''
    });
  }

  handleChange = (e) => {
    this.setState({
      single_comment: e.target.value
    });
    console.log(this.state.single_comment);
  }

  getPost = (key) => {
    this.props.firebase.ref('posts/' + key).on()
  }

  render() {
    let posts = this.props.posts;
    let _this = this;

    if (!posts) {
      return false;
    }

    if (this.props.loading) {
      return (
        <div>
          Loading...
        </div>
      );
    }

    return (
      <div className="Posts">
        <Navbar />
        <div>
        {
          Object.keys(posts).reverse().map(function(key) {
            let comments = posts[key].comments;
            let num = posts[key].num_comments;
            return (
              <div id ="scr" class="containerPosts">
                <br />
                <div id="post1" class="post" onclick="">
                  <div class="title" key={key}>
                      <div>{ posts[key].title }</div>
                  </div>
                  <div class="text" key={key}>
                      <ReactFitText compressor={Math.max(Math.log10(posts[key].content.length)*3, 7)}>
                      <div>{ posts[key].content }</div>
                      </ReactFitText>
                  </div>
                  <div class="menu" key={key}>
                    <div style={{color: '#000'}}>
                      Agreements: { posts[key].upvote } &nbsp;
                      <button class='bouton'
                        style={{outline: 'none'}}
                        onClick={ _this.handleUpvote.bind(this, posts[key], key) }
                        type="button"
                      >
                         Agree
                      </button>

                      <button class='bouton'
                        style={{outline: 'none'}}
                        onClick={ _this.handleComment.bind(this, posts[key], key) }
                        type="button"
                      >
                        Add Comment
                      </button>
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  class="comment"
                  placeholder="Add a Comment"
                  style={{outline: 'none'}}
                  onChange={ _this.handleChange }
                  value={ _this.state.single_comment }
                  style = {{height: 40}}
                />
                { comments.map(function (obj){
                  if(obj ==""){
                    return(<div></div>);
                  }
                  return(
                    <div class="comment" style = {{height: 40, verticalAlign:"middle"}}>{ obj }</div>
                  );
                })}
              </div>

            );
          })
        }
        </div>
      </div>
    );
  }
}

export default Posts;
