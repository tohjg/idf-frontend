import MemberController from './controllers/member.js'

(($) => {
  const MAX_MEMBER_IN_FORM = 5
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

      // todo: add validation
      // $self.find('#name').on('keyup paste', validator.required)
      // $self.find('#email').on('keyup paste', ((e) => validator.required(validator.email(e))))

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
