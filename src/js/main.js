import ColleagueController from './controllers/colleague.js'
import AddColleagueWidget from './views/widget-add-colleague.js'
import ExistingColleagueWidget from './views/widget-existing-colleagues.js'

(($) => {
  $(document).ready(() => {
    // when dom is ready

    // init colleague model controller to handle:
    // 1. data transaction in LocalStorage
    // 2. in-memory data transaction
    // 3. proxy in between all the view
    const colleagueController = new ColleagueController()

    // init widgets
    // 'Add colleague'
    const addColleagueWidget = new AddColleagueWidget(colleagueController)

    // 'Exisiting colleague'
    const existingColleagueWidget = new ExistingColleagueWidget(colleagueController)
  })
})(jQuery)
