import Colleague from '../models/colleague.js'

const STORAGE_KEY = 'idf_frontend_colleagues'
const isLocalStorageAvailable = () => {
  try {
    var storage = window['localStorage'],
        x = '__storage_test__'

    // test storage writing
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  }
  catch(e) {
      return e instanceof DOMException && (
          // everything except Firefox
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          storage.length !== 0
  }
}

const TOTAL_MEMBERS = 10

export default class {
  constructor() {
    this.colleagues = []

    if (isLocalStorageAvailable()) {
      // populate data from localstorage
      this.colleagues = Colleague.fromArray(
        JSON.parse(localStorage.getItem(STORAGE_KEY))
      )
    } else {
      console.warn('localStorage is not available. Using memory as storage')
    }
  }

  save() {
    if (isLocalStorageAvailable()) {
      // save colleagues into local storage
      // value must be json string as local storage only receive string only
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.colleagues))
    }
  }

  add({name, email}) {
    if (this.colleagues.length < this.total) {
      // assume there are some space to add
      this.colleagues.push(new Colleague(name, email))
    }
  }

  remove(colleague) {
    const idx = this.colleagues.indexOf(colleague)
    if (idx > -1) {
      // assume colleague still in the list

      // remove it
      this.colleagues.splice(idx, 1)

      // save to localstorage
      this.save()

      return true
    }
    return false
  }

  hardReset() {
    // for development use only
    this.colleagues = []
    this.save()
  }

  get total() {
    return TOTAL_MEMBERS
  }
}
