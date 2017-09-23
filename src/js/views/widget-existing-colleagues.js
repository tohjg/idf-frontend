import ColleagueInfo from './colleague-info.js'

export default class {
  constructor(colleagueController) {
    this.colleagueController = colleagueController
    this.colleagueController.on('added', (colleague) => {
      // when new colleague added to the datastore

      this.populateItem(colleague)
    })
    this.populate()
  }

  populate() {
    if (this.colleagueController.colleagues.length > 0) {
      // assume template is available and has colleagues

      this.colleagueController.colleagues.forEach((colleague) => {
        this.populateItem(colleague)
      })
    }
  }

  populateItem(colleague) {
    // create colleague info view
    const info = new ColleagueInfo(colleague)
    info.on('removed', () => {
      // user delete this colleague info from existing list
      this.colleagueController.remove(colleague)
    })
  }
}
