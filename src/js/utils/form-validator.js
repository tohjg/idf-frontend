export default class {

  /**
   * check if input field is empty
   * @param {jQuery} $field input field
   */
  required($field) {
    return $field.val() !== "";
  }

  /**
   * check if input value is a valid email address
   * @param {jQuery} $field input field
   */
  email($field) {
    const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return emailReg.test($field.val())
  }
}
