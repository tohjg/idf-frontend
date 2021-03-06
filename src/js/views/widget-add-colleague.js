import ColleagueForm from './form-colleague.js'

const MAX_COLLEAGUE_IN_FORM = 10

/**
 * Add colleague forms widget
 */
export default class AddColleagueWidget {
  constructor(colleagueController) {
    this.colleagueController = colleagueController

    this.colleagueController.on('removed', () => {
      // assume existing colleague has being removed
      this.updateCount()
    })

    // cache array in ColleagueFrom instance
    // to store forms in the DOM
    this.colleagueForms = []

    // update colleague count based
    this.updateCount()

    // add the first form for initial stage
    this.addForm()

    // click listeners
    // 'add another colleague' link to add new colleague form
    $('#add-colleague-link').click((e) => {
      // check if total form is exceed max existing colleagues number
      if (this.colleagueController.colleagues.length + this.colleagueForms.length + 1 <= this.colleagueController.total) {
        this.addForm()
      }
    })

    // 'reset form' button
    $('#reset-btn').click((e) => {
      this.resetForm()
    })

    // 'add all the colleagues' button
    // to add all the filled colleague form to data controller
    $('#add-colleague-btn').click((e) => this.addColleagueToStorage(colleagueController))
  }

  /**
   * update total colleagues has being added and number of colleagues that user can add
   */
  updateCount() {
    // text view for number of colleagues that user can add
    const $left = $('#colleague-left')
    // text view for total colleagues has being added (in memory)
    const $total = $('#colleague-total')

    $total.text(this.colleagueController.colleagues.length)
    $left.text((this.colleagueController.total - this.colleagueController.colleagues.length) + ' colleague'+ (this.colleagueController.colleagues.length > 1 ? '' : 's'))
  }

  /**
   * adding new form
   */
  addForm() {
    const $colleagueFormTmpl = $('#add-colleague-template')
    const $formContainer = $('.colleagues')

    if (this.colleagueForms.length < MAX_COLLEAGUE_IN_FORM) {
      // assume colleague form count is less than (MAX_COLLEAGUE_IN_FORM)

      const form = new ColleagueForm($colleagueFormTmpl)

      form.on('removing', () => {
        // this form is going to remove

        if (this.colleagueForms.length > 1) {
          // there's more than 2 forms available
          // allow to remove the current form
          this.removeForm(form)
        }
      })

      form.on('removed', () => {
        // this form has being removed

        // remove this form from cacahe
        this.removeForm(form)
      })

      // init the form and it should return newly create form
      // and append to the form container
      $formContainer.append(form.init())

      // register form
      this.colleagueForms.push(form)

      // update 'add 'em all' button label
      this.updateAddButtonLabel()
    }
  }

  /**
   * removing the form from cache and update 'add' button label
   * @param {ColleagueForm} form
   */
  removeForm(form) {
    // find out the index of the form in the form cache
    const idx = this.colleagueForms.indexOf(form)

    if (idx > -1) {
      // assume the form is not removed from cache

      this.colleagueForms.splice(idx, 1)

      // update add button label with new number of colleague form to be added
      this.updateAddButtonLabel()

      // remove the form from DOM
      form.remove()
      return true
    }
    return false
  }

  /**
   * update 'add colleague' button label
   */
  updateAddButtonLabel() {
    if (this.colleagueForms.length == 1) {
      // just a single form
      $('#add-colleague-btn').text(`Add a colleague`)
    } else {
      // more than that
      $('#add-colleague-btn').text(`Add ${this.colleagueForms.length} colleagues`)
    }
  }

  /**
   * reset all the forms to initial stage
   */
  resetForm() {
    // remove all form
    $('.colleague:not(.hide)').remove()

    // reset counter
    this.colleagueForms = []

    // add new form
    this.addForm()
  }

  /**
   * invalidate and save all the colleagues that filled in the form
   */
  addColleagueToStorage() {
    // break this function if total colleagues has reach the max
    if (this.colleagueController.colleagues.length >= this.colleagueController.total)
      return

    const formGarbageCollector = []

    this.colleagueForms.forEach((form) => {
      console.log('iterate form', form.getFormData())
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
      // add data to controller
      this.colleagueController.add(form.getFormData())

      // remove the form later
      // remove it now cause iteration interrupted
      formGarbageCollector.push(form)
    })

    // assume all field is valid

    // removing form from garbage collector
    console.warn('todo: try to use single loop interaction for better performance')
    formGarbageCollector.forEach((form) => {
      this.removeForm(form)
    })

    // save to localStorage
    this.colleagueController.save()

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
