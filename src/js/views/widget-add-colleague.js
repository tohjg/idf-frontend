import ColleagueForm from './form-colleague.js'

let colleagueFormCount = 0
const MAX_COLLEAGUE_IN_FORM = 10

export default class AddColleagueWidget {
  constructor(colleagueController) {
    this.colleagueController = colleagueController

    this.colleagueController.on('removed', () => {
      // assume existing colleague has being removed
      this.updateCount()
    })

    // array to store forms in ColleagueForm instance
    this.colleagueForms = []

    // update colleague count based
    this.updateCount()

    // add the first form for initial stage
    this.addForm()

    // add click listener to 'add another colleague' link
    // to add new colleague form
    $('#add-colleague-link').click((e) => {
      // check if total form is exceed max colleagues number
      if (this.colleagueController.colleagues.length + colleagueFormCount + 1 <= this.colleagueController.total) {
        this.addForm()
      }
    })

    // click listener for 'reset' button
    $('#reset-btn').click((e) => {
      this.resetForm()
    })

    // click listener to 'add all the colleagues' button
    // to add all the filled colleague form to storage
    // and populate out @ existing colleagues
    $('#add-colleague-btn').click((e) => this.addColleagueToStorage(colleagueController))
  }

  updateCount() {
    const $left = $('#colleague-left')
    const $total = $('#colleague-total')

    // update colleague
    $total.text(this.colleagueController.colleagues.length)
    // update how many colleague that user can add
    $left.text((this.colleagueController.total - this.colleagueController.colleagues.length) + ' colleague'+ (this.colleagueController.colleagues.length > 1 ? '' : 's'))
  }

  addForm() {
    const $colleagueFormTmpl = $('#add-colleague-template')
    const $formContainer = $('.colleagues')

    // add colleague form if form count is less than (MAX_COLLEAGUE_IN_FORM)
    if (colleagueFormCount < MAX_COLLEAGUE_IN_FORM) {
      const form = new ColleagueForm($colleagueFormTmpl)

      form.on('removing', () => {
        // this form is going to remove

        if (colleagueFormCount > 1) {
          // there's more than 2 forms available
          // allow to remove the current form
          form.remove();
        }
      })

      form.on('removed', () => {
        // this form has being removed

        // update form count
        colleagueFormCount --
        // and add button label
        this.updateAddButtonLabel()
      })

      // init the form and it should return newly create form
      // and append to the form container
      $formContainer.append(form.init())

      // register form
      this.colleagueForms.push(form)

      // increment form count
      colleagueFormCount ++

      // change 'add 'em all' button label
      this.updateAddButtonLabel()
    }
  }

  updateAddButtonLabel() {
    if (colleagueFormCount == 1) {
      // just a single form
      $('#add-colleague-btn').text(`Add a colleague`)
    } else {
      // more than that
      $('#add-colleague-btn').text(`Add ${colleagueFormCount} colleagues`)
    }
  }

  resetForm() {
    // remove all form
    $('.colleague:not(.hide)').remove()

    // reset counter
    colleagueFormCount = 0

    // add new form
    this.addForm()
  }

  addColleagueToStorage() {
    // break this function if total colleagues has reach the max
    if (this.colleagueController.colleagues.length >= this.colleagueController.total)
      return

    this.colleagueForms.forEach((form) => {
      if (!form.invalidateNameField()) {
        // break! name field is invalid
        return
      }

      if (!form.invalidateEmailField()) {
        // break! email field is invalid
        return
      }

      if (form.checkEmailExist(this.colleagueController.colleagues)) {
        // brak! email address already added
        return
      }

      // assume validation successful
      // save add data to controller
      this.colleagueController.add(form.getFormData())

      // remove the form
      form.remove()
    })

    // assume all field is valid

    // save to localStorage
    this.colleagueController.save()

    // populate all the colleague in 'Existing colleagues'
    //populateColleagues(colleagueController)

    // update colleague count
    this.updateCount()

    if ($('.colleague:not(.hide)').length == 0) {
      // assume there's no more form available
      // add new form
      this.addForm()
    }

    // update add button label
    this.updateAddButtonLabel()
  }
}
