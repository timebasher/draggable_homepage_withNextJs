import React, { Component } from "react";
import "isomorphic-fetch";
import { ValidatorForm } from "react-form-validator-core";
import Validator from "./Validator";
import TextareaValidator from "./TextareaValidator";
import contactForm from "../../../css/contactForm.css";
import fetch from "isomorphic-unfetch";

class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      submitted: false,
      FormValid: false,
      email: "",
      message: "",
      name: ""
    };
  }

  checkStatus() {
    fetch("https://www.johannes-walenta.de/api/contact", {
      method: "get"
    })
      //.then(res => res.json())
      .then(json => console.log(json))
      .catch(e => console.log(e));
  }

  handleChangeName(event) {
    this.setState({ name: event.target.value });
  }

  handleChangeEmail(event) {
    this.setState({ email: event.target.value });
  }
  handleChangeMessage(event) {
    this.setState({ message: event.target.value });
  }

  submitForm() {
    if (this.state.FormValid) {
      const { email, message, name } = this.state;

      fetch("/api/contact", {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, message, name })
      })
        .then(res => {
          res.status === 200 ? this.setState({ submitted: true }) : "";
        })
        .then(() => this.checkStatus());
    } else {
      return;
    }
  }
  componentDidMount() {
    this.runFormvalidation();
  }
  runFormvalidation = () => {
    const result = this.form.walk(this.form.childs);
    this.setState({ FormValid: result });
    console.log(result); // result will be true or false
  };

  render() {
    console.log(this.props);
    return (
      <div>
        <ValidatorForm
          className="board-form"
          ref={r => (this.form = r)}
          onChange={this.runFormvalidation}
          onSubmit={e => {
            e.preventDefault();
            this.submitForm() && this.getInitialProps();
          }}
        >
          <h2>Contact</h2>
          <hr style={{ width: "598px" }} />
          <br />
          <div>
            <div className="ContactBox">
              <label>
                Name :
                <Validator
                  name="name"
                  label="Name"
                  validators={[
                    "required",
                    "minStringLength: 2",
                    "maxStringLength: 30"
                  ]}
                  errorMessages={[
                    "Please tell me your name",
                    "Your name is to Short",
                    "Your name is to Long"
                  ]}
                  value={this.state.name}
                  onChange={this.handleChangeName.bind(this)}
                />
              </label>
            </div>
            <div className="ContactBox">
              <label>
                Email :
                <Validator
                  name="email"
                  label="Email"
                  validators={["required", "isEmail"]}
                  errorMessages={[
                    "Please fill in a Email",
                    "This is not a real Email-Address"
                  ]}
                  value={this.state.email}
                  onChange={this.handleChangeEmail.bind(this)}
                />
              </label>
            </div>
            <div className="ContactBox">
              <label>
                Message :
                <TextareaValidator
                  name="message"
                  label="Message"
                  validators={[
                    "required",
                    "minStringLength: 2",
                    "maxStringLength: 500"
                  ]}
                  errorMessages={[
                    "Please write a Message",
                    "Your Message is too short",
                    "Your Message is too long"
                  ]}
                  value={this.state.message}
                  onChange={this.handleChangeMessage.bind(this)}
                />
              </label>
            </div>
          </div>
          <div>
            {this.state.FormValid ? (
              <button type="submit" className="SendButton">
                Send a Message
              </button>
            ) : (
              <button type="submit" disabled className="SendButton">
                Send a Message
              </button>
            )}
          </div>
        </ValidatorForm>
        <div>{this.props.string}</div>
      </div>
    );
  }
}

Contact.getInitialProps = async ({ query }) => ({ string: query.string });

export default Contact;
