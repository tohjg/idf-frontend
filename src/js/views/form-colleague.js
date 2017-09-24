import Validator from '../utils/form-validator.js'
import EventEmitter from '../utils/event-emitter.js'

const validator = new Validator();

/**
 * check if the input field is empty
 * @param {jQuery} $field input field to be validated
 */
const invalidateEmptyField = ($field) => {
  const isValid = validator.required($field)

  if (!isValid) {
    // assume field is empty

    $field.addClass('invalid')
    // show 'field is empty' in message tip
    showMessageTip($field, 'Field is empty')
  } else {
    // assume field is in invalid mode
    // correct it by removing invalid class
    $field.removeClass('invalid')
    hideMessageTip($field)
  }

  return isValid
}

/**
 * check if the input field value is valid email address format
 * @param {jQuery} $field input field to be validated
 */
const invalidateEmailFormat = ($field) => {
  // invalidate email format
  const isValid = validator.email($field)

  if (!isValid) {
    // assume field is empty or invalid email
    $field.addClass('invalid')
    // show 'email is invalid' in message tip
    showMessageTip($field, 'Email is invalid')
  } else {
    $field.removeClass('invalid')
    hideMessageTip($field)
  }

  return isValid
}

/**
 * show error message on message tip on each input field
 * @param {jQuery} $field target input field
 * @param {string} msg message to be show
 */
const showMessageTip = ($field, msg) => {
  // message-tip class must be wrapped with input-group class
  const $messageTip = $field.parents('.input-group').find('.message-tip')

  // show it out
  $messageTip.removeClass('hide')
  $messageTip.text(msg)
}

/**
 * hide error message tip
 * @param {jQuery} $field target input field
 */
const hideMessageTip = ($field) => {
  const $messageTip = $field.parents('.input-group').find('.message-tip')
  $messageTip.addClass('hide')
}


/**
 * single colleague form component
 */
export default class ColleagueForm extends EventEmitter {
  constructor($formTemplate) {
    super()

    this.$self = $formTemplate.clone()
      // show it
      .removeClass('hide')
  }

  /**
   * initialise colleague form
   * @return {jQuery} this form in jQuery DOM
   */
  init() {
    // listen to remove colleague form listener
    this.$self.find('.remove-colleague').click((evt) => {
      // to confirm removing this form
      this.emit('removing')
    })

    // name field validation
    this.$self.find('#name').on('keyup', (e) => {
      this.invalidateNameField()
    })

    // email field validation
    this.$self.find('#email').on('keyup', (e) => {
      this.invalidateEmailField()
    })

    return this.$self
  }

  /**
   * remove this form
   */
  remove() {
    // remove the form
    this.$self.remove()

    // inform that this form has being removed
    this.emit('removed')
  }

  /**
   * invalidate name input field
   */
  invalidateNameField() {
    const $field = this.$self.find('#name')
    return invalidateEmptyField($field)
  }

  /**
   * invalidate email input field
   */
  invalidateEmailField() {
    const $field = this.$self.find('#email')
    if (!invalidateEmptyField($field))
      // email field is empty
      return false

    return invalidateEmailFormat($field)
  }

  /**
   * check if email already exists in array
   * @param {array<Colleague>} colleagues
   */
  checkEmailExist(colleagues) {
    const lookupEmail = this.$self.find('#email').val()

    // skip checking since there are no data to check up
    if (colleagues.length == 0) return false

    // Array.every iterates array until a test has failed.
    const found = !colleagues.every((colleague) => {
      //   ^... why exclamation is here?
      //
      // function should return true when colleague email is not similar email from the DOM,
      // otherwise false when found and break from the loop
      // thus exclamation will flip the boolean switch to true
      return (colleague.email !== lookupEmail)
    })

    if (found) {
      // show message saying 'Email already exist'
      showMessageTip(this.$self.find('#email'), 'Email already exist')
    }

    return found
  }

  /**
   * get name and email data in object format
   */
  getFormData() {
    return {
      name: this.$self.find('#name').val(),
      email: this.$self.find('#email').val()
    }
  }

}
