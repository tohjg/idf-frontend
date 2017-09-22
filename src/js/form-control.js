import MemberController from './controllers/member.js'
import Validator from './utils/form-validator.js'
(($) => {
  const MAX_MEMBER_IN_FORM = 5
  const validator = new Validator()
  let memberFormCount = 0

  const populateMembers = (memberController) => {
    const $tmpl = $('#member_template')
    const $container = $('.member-added')
    if ($tmpl.length != 1) {
      console.warn('Member template is not found in the HTML')
      return
    }

    if (memberController.members.length > 0) {
      // assume template is available and has members

      memberController.members.forEach((member) => {
        // check if member has populated in DOM
        if ($container.find('#member_template:not(.hide)').find('#email:contains("'+member.email+'")').length == 0) {
          // clone from new member template
          const $self = $tmpl.clone()
          // and show up
          .removeClass('hide')

          // populate model data to view
          $self.find('#name').text(member.name)
          $self.find('#email').text(member.email)

          // add click listener to remove icon
          $self.find('.remove-member').click((e) => {
            // remove it
            memberController.remove(member)

            // remove itself from the view
            // not matter if the member still exist in the list
            $self.remove()
          })

          // append to the dom
          $container.append($self)
        }
      })
    }
  }

  const updateMembersCount = (memberController) => {
    const $left = $('#member-left')
    const $total = $('#member-total')

    $total.text(memberController.members.length)
    $left.text((memberController.total - memberController.members.length) + ' colleague'+ (memberController.members.length > 1 ? '' : 's'))
  }

  const invalidateRequire = ($field) => {
    // invalidate empty field
    const isValid = validator.required($field)
    if (!isValid) {
      // assume field is empty
      $field.addClass('invalid')
    } else {
      $field.removeClass('invalid')
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
    } else {
      $emailField.removeClass('invalid')
    }

    return isValid
  }

  const checkEmailExist = ($emailField, members) => {
    const lookupEmail = $emailField.val()

    // skip checking since there are no data to check up
    if (members.length == 0) return false

    // Array.every iterates array until a test has failed.
    return !members.every((member) => {
      //   ^... why exclamation is here?
      //
      // function should return true when member email is not similar email from the DOM,
      // otherwise false when found and break from the loop
      // thus exclamation will flip the boolean switch to true
      return (member.email !== lookupEmail)
    })
  }

  const addMemberForm = () => {
    const $memberFormTmpl = $('#add-member-template')
    const $formContainer = $('.members')

    if (memberFormCount < MAX_MEMBER_IN_FORM) {
      // clone a template
      const $self = $memberFormTmpl.clone()
        // show it
        .removeClass('hide')

      // listen to remove member form listener
      $self.find('.remove-member').click((evt) => {
        if (memberFormCount > 1) {

          // remove the form
          $self.remove()

          // update form count
          memberFormCount --
          updateAddColleagueButtonLabel();
        }
      })

      // name field validation
      $self.find('#name').on('keyup', (e) => invalidateRequire($(e.currentTarget)))

      // email field validation
      $self.find('#email').on('keyup', (e) => invalidateEmail($(e.currentTarget)))

      $formContainer.append($self)

      // increment form count
      memberFormCount ++

      // change 'add 'em all' button label
      updateAddColleagueButtonLabel()
    }
  }

  const addMemberToStorage = (memberController) => {
    const $memberForms = $('.member:not(.hide)').toArray()

    // clone members from memberController
    const members = memberController.members

    $memberForms.forEach((form) => {
      const $form = $(form)
      const $name = $form.find('#name')
      const $email = $form.find('#email')
      let isValid = true

      // invalidate name field
      if (!invalidateRequire($name)) {
        // assume name is invalid
        console.warn('todo: show error on name textfield, saying field is required')
        return
      }
      console.log('name is valid')

      // invalidate email field
      if (!invalidateRequire($email) && !invalidateEmail($email)) {
        // assume email is not valid email format
        console.warn('todo: show error saying email is invalid format')
        return
      }
      console.log('email is valid')

      // invalidate email must not exist in the list
      if (checkEmailExist($email, members)) {
        // assume email is already added
        console.warn('todo: show error saying email has exist in the list')
        return
      }
      console.log('email address is not in the list')

      // validation passed!
      const name = $name.val()
      const email = $email.val()

      memberController.add({name, email})

      // remove the form
      $form.remove()

      memberFormCount --
    })

    // assume all field is valid

    // register all the data to memberController.member
    memberController.members = members

    // save to localStorage
    memberController.save()

    // populate all the member in 'Existing colleagues'
    populateMembers(memberController)

    // update member count
    updateMembersCount(memberController)

    if ($('.member:not(.hide)').length == 0) {
      // assume there's no more form available
      // add new form
      addMemberForm()
    }

    // update add button label
    updateAddColleagueButtonLabel()
  }

  const updateAddColleagueButtonLabel = () => {
    if (memberFormCount == 1) {
      // just a single form
      $('#add-member-btn').text(`Add a colleague`)
    } else {
      // more than that
      $('#add-member-btn').text(`Add ${memberFormCount} colleagues`)
    }
  }

  $(document).ready(() => {
    // when dom is ready

    // init member model controller
    const memberController = new MemberController()

    if (memberController.members.length > 0) {
      // populate all the members to existing colleague
      populateMembers(memberController)
    }

    // update member count based
    updateMembersCount(memberController)

    // populate the first form
    addMemberForm()

    // add click listener to 'add another colleague' link
    // to add new colleague form
    $('#add-member-link').click(addMemberForm)

    // click listener to 'add all the colleagues' button
    // to add all the filled colleague form to storage
    // and populate out @ existing colleagues
    $('#add-member-btn').click((e) => addMemberToStorage(memberController))

    // click listener for 'reset' button
    $('#reset-btn').click((e) => memberController.hardReset())
  })
})(jQuery)
