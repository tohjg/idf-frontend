import ColleagueController from './controllers/colleague.js'
import Validator from './utils/form-validator.js'
(($) => {
  const MAX_COLLEAGUE_IN_FORM = 10
  const validator = new Validator()
  let colleagueFormCount = 0

  const populateColleagues = (colleagueController) => {
    const $tmpl = $('#colleague_template')
    const $container = $('.colleague-added')
    if ($tmpl.length != 1) {
      console.warn('colleague template is not found in the HTML')
      return
    }

    if (colleagueController.colleagues.length > 0) {
      // assume template is available and has colleagues

      colleagueController.colleagues.forEach((colleague) => {
        // check if colleague has populated in DOM
        if ($container.find('#colleague_template:not(.hide)').find('#email:contains("'+colleague.email+'")').length == 0) {
          // clone from new colleague template
          const $self = $tmpl.clone()
          // and show up
          .removeClass('hide')

          // populate model data to view
          $self.find('#name').text(colleague.name)
          $self.find('#email').text(colleague.email)

          // add click listener to remove icon
          $self.find('.remove-colleague').click((e) => {
            // remove it
            colleagueController.remove(colleague)

            // update colleague count
            updateColleaguesCount(colleagueController)

            // remove itself from the view
            // not matter if the colleague still exist in the list
            $self.remove()
          })

          // append to the dom
          $container.append($self)
        }
      })
    }
  }

  const updateColleaguesCount = (colleagueController) => {
    const $left = $('#colleague-left')
    const $total = $('#colleague-total')

    $total.text(colleagueController.colleagues.length)
    $left.text((colleagueController.total - colleagueController.colleagues.length) + ' colleague'+ (colleagueController.colleagues.length > 1 ? '' : 's'))
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

  const invalidateRequire = ($field) => {
    // invalidate empty field
    const isValid = validator.required($field)
    if (!isValid) {
      // assume field is empty

      $field.addClass('invalid')
      // show 'field is empty' in message tip
      showMessageTip($field, 'Field is empty')
    } else {
      $field.removeClass('invalid')
      hideMessageTip($field)
    }

    return isValid
  }

  const invalidateEmail = ($emailField) => {
    // invalidate empty field
    let isValid = validator.required($emailField)
    // invalidate email format
    isValid = validator.email($emailField)

    if (!isValid) {
      // assume field is empty or invalid email
      $emailField.addClass('invalid')
      // show 'email is invalid' in message tip
      showMessageTip($emailField, 'Email is invalid')
    } else {
      $emailField.removeClass('invalid')
      hideMessageTip($emailField)
    }

    return isValid
  }

  const checkEmailExist = ($emailField, colleagues) => {
    const lookupEmail = $emailField.val()

    // skip checking since there are no data to check up
    if (colleagues.length == 0) return false

    // Array.every iterates array until a test has failed.
    return !colleagues.every((colleague) => {
      //   ^... why exclamation is here?
      //
      // function should return true when colleague email is not similar email from the DOM,
      // otherwise false when found and break from the loop
      // thus exclamation will flip the boolean switch to true
      return (colleague.email !== lookupEmail)
    })
  }

  const addColleagueForm = () => {
    const $colleagueFormTmpl = $('#add-colleague-template')
    const $formContainer = $('.colleagues')

    // add colleague form if form count is less than 5 (MAX_COLLEAGUE_IN_FORM)
    if (colleagueFormCount < MAX_COLLEAGUE_IN_FORM) {
      // clone a template
      const $self = $colleagueFormTmpl.clone()
        // show it
        .removeClass('hide')

      // listen to remove colleague form listener
      $self.find('.remove-colleague').click((evt) => {
        if (colleagueFormCount > 1) {

          // remove the form
          $self.remove()

          // update form count
          colleagueFormCount --
          updateAddColleagueButtonLabel()
        }
      })

      // name field validation
      $self.find('#name').on('keyup', (e) => invalidateRequire($(e.currentTarget)))

      // email field validation
      $self.find('#email').on('keyup', (e) => invalidateEmail($(e.currentTarget)))

      $formContainer.append($self)

      // increment form count
      colleagueFormCount ++

      // change 'add 'em all' button label
      updateAddColleagueButtonLabel()
    }
  }

  const addColleagueToStorage = (colleagueController) => {
    // break this function if total colleagues has reach the max
    if (colleagueController.colleagues.length >= colleagueController.total)
      return

    const $colleagueForms = $('.colleague:not(.hide)').toArray()

    // clone colleagues from colleagueController
    const colleagues = colleagueController.colleagues

    $colleagueForms.forEach((form) => {
      const $form = $(form)
      const $name = $form.find('#name')
      const $email = $form.find('#email')
      let isValid = true

      // invalidate name field
      if (!invalidateRequire($name)) {
        // assume name is invalid
        return
      }
      console.log('name is valid')

      // invalidate email field
      if (!invalidateRequire($email)) {
        // assume email is not valid email format
        return
      }
      console.log('email is valid')

      // invalidate email format
      if (!invalidateEmail($email)) {
        return
      }
      console.log('email format is valid')

      // invalidate email must not exist in the list
      if (checkEmailExist($email, colleagues)) {
        // assume email is already added
        showMessageTip($email, 'Email already exist')
        return
      }
      console.log('email address is not in the list')

      // validation passed!
      const name = $name.val()
      const email = $email.val()

      colleagueController.add({name, email})

      // remove the form
      $form.remove()

      colleagueFormCount --
    })

    // assume all field is valid

    // register all the data to colleagueController.colleague
    colleagueController.colleagues = colleagues

    // save to localStorage
    colleagueController.save()

    // populate all the colleague in 'Existing colleagues'
    populateColleagues(colleagueController)

    // update colleague count
    updateColleaguesCount(colleagueController)

    if ($('.colleague:not(.hide)').length == 0) {
      // assume there's no more form available
      // add new form
      addColleagueForm()
    }

    // update add button label
    updateAddColleagueButtonLabel()
  }

  const resetForm = () => {
    const $colleagueForms = $('.colleague:not(.hide)').toArray()

    // remove all form
    $colleagueForms.forEach((form) => {
      const $form = $(form)
      $form.remove()
    })

    // add new form
    addColleagueForm()
  }

  const updateAddColleagueButtonLabel = () => {
    if (colleagueFormCount == 1) {
      // just a single form
      $('#add-colleague-btn').text(`Add a colleague`)
    } else {
      // more than that
      $('#add-colleague-btn').text(`Add ${colleagueFormCount} colleagues`)
    }
  }

  $(document).ready(() => {
    // when dom is ready

    // init colleague model controller
    const colleagueController = new ColleagueController()

    if (colleagueController.colleagues.length > 0) {
      // populate all the colleagues to existing colleague
      populateColleagues(colleagueController)
    }

    // update colleague count based
    updateColleaguesCount(colleagueController)

    // populate the first form
    addColleagueForm()

    // add click listener to 'add another colleague' link
    // to add new colleague form
    $('#add-colleague-link').click((e) => {
      // check if total form is exceed max colleagues number
      if (colleagueController.colleagues.length + colleagueFormCount + 1 <= colleagueController.total) {
        addColleagueForm()
      }
    })

    // click listener to 'add all the colleagues' button
    // to add all the filled colleague form to storage
    // and populate out @ existing colleagues
    $('#add-colleague-btn').click((e) => addColleagueToStorage(colleagueController))

    // click listener for 'reset' button
    $('#reset-btn').click((e) => {
      console.warn('todo: reset available form')
      resetForm();
    })
  })
})(jQuery)
