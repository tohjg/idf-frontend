import ColleagueController from './controllers/colleague.js'
import AddColleagueWidget from './views/widget-add-colleague.js'
import ExistingColleagueWidget from './views/widget-existing-colleagues.js'

(($) => {
  $(document).ready(() => {
    // when dom is ready

    // init colleague model controller
    const colleagueController = new ColleagueController()

    // init widgets
    // 'Add colleague'
    const addColleagueWidget = new AddColleagueWidget(colleagueController)

    // 'Exisiting colleague'
    const existingColleagueWidget = new ExistingColleagueWidget(colleagueController)
  })
})(jQuery)
