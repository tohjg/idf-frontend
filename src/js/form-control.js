import MemberController from './controllers/member.js'
import Validator from './utils/form-validator.js'
(($) => {
  const MAX_MEMBER_IN_FORM = 5
  const validator = new Validator()
  let memberFormCount = 0

  const populateMembers = (members) => {
    const $tmpl = $('#member_template')
    if ($tmpl.length != 1) {
      console.warn('Member template is not found in the HTML')
      return
    }

    if (members.length > 0) {
      // assume template is available and has members
      console.log('todo: duplicate template and write on it and append')
    }
  }

  const updateMembersCount = (memberController) => {
    const $left = $('#member-left')
    const $total = $('#member-total')

    $total.text(memberController.members.length)
    $left.text(memberController.total - memberController.members.length)
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
          $self.remove();
          memberFormCount --;
        }
      })

      // name field validation
      $self.find('#name').on('keyup paste', (e) => {
        // invalidate empty field
        if (!validator.required(e)) {
          // assume field is empty
          $(e.currentTarget).addClass('invalid')
        } else {
          $(e.currentTarget).removeClass('invalid')
        }
      })

      // email field validation
      $self.find('#email').on('keyup paste', (e) => {
        // invalidate empty field
        let isValid = validator.required(e)
        // invalidate email format
        isValid = validator.email(e)

        if (!isValid) {
          // assume field is empty or invalid email
          $(e.currentTarget).addClass('invalid')
        } else {
          $(e.currentTarget).removeClass('invalid')
        }
      })

      $formContainer.append($self)

      // increment form count
      memberFormCount ++
    }
  }

  $(document).ready(() => {

    const memberController = new MemberController();

    if (memberController.members.length > 0) {
      // populate all the members to existing colleague
      populateMembers(memberController.members)
    }

    // update member count based
    updateMembersCount(memberController)

    // populate the first form
    addMemberForm();

    // add click listener to 'add another colleague' link
    $('.add-member').click(addMemberForm);
  })
})(jQuery)
