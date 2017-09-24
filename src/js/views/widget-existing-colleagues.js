import ColleagueInfo from './colleague-info.js'

/**
 * Existing colleagues widget
 */
export default class {
  constructor(colleagueController) {
    this.colleagueController = colleagueController

    this.colleagueController.on('added', (colleague) => {
      // when new colleague added to the datastore

      this.populateItem(colleague)
    })
    this.populate()
  }

  /**
   * populate all colleague
   */
  populate() {
    if (this.colleagueController.colleagues.length > 0) {
      // assume template is available and has colleagues

      this.colleagueController.colleagues.forEach((colleague) => {
        this.populateItem(colleague)
      })
    }
  }

  /**
   * populate specific colleague info
   * @param {Colleague} colleague
   */
  populateItem(colleague) {
    // create colleague info view
    const info = new ColleagueInfo(colleague)
    info.on('removed', () => {
      // user delete this colleague info from existing list
      this.colleagueController.remove(colleague)
    })
  }
}
