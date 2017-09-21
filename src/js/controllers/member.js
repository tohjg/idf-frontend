import Member from '../models/member.js'

const STORAGE_KEY = 'idf_frontend_members'
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

const TOTAL_MEMBERS = 10;

export default class {
  constructor() {
    this.members = []

    if (isLocalStorageAvailable()) {
      // populate data from localstorage
      this.members = Member.fromArray(localStorage.getItem(STORAGE_KEY))
    } else {
      console.warn('localStorage is not available. Using memory as storage')
    }
  }

  save() {
    if (isLocalStorageAvailable()) {
      localStorage.setItem(STORAGE_KEY, this.members);
    }
  }

  get total() {
    return TOTAL_MEMBERS
  }
}
