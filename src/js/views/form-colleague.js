import Validator from '../utils/form-validator.js'
import EventEmitter from '../utils/event-emitter.js'

const validator = new Validator();

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

const showMessageTip = ($field, msg) => {
  // message-tip class must be wrapped with input-group class
  const $messageTip = $field.parents('.input-group').find('.message-tip')

  // show it out
  $messageTip.removeClass('hide')
  $messageTip.text(msg)
}

const hideMessageTip = ($field) => {
  const $messageTip = $field.parents('.input-group').find('.message-tip')
  $messageTip.addClass('hide')
}

export default class ColleagueForm extends EventEmitter {
  constructor($formTemplate) {
    super()

    this.$self = $formTemplate.clone()
      // show it
      .removeClass('hide')
  }

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

  remove() {
    // remove the form
    this.$self.remove()

    // inform that this form has being removed
    this.emit('removed')
  }

  invalidateNameField() {
    const $field = this.$self.find('#name')
    return invalidateEmptyField($field)
  }

  invalidateEmailField() {
    const $field = this.$self.find('#email')
    if (!invalidateEmptyField($field))
      // email field is empty
      return false

    return invalidateEmailFormat($field)
  }

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

  getFormData() {
    return {
      name: this.$self.find('#name').val(),
      email: this.$self.find('#email').val()
    }
  }

}
