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
      this.members = Member.fromArray(
        JSON.parse(localStorage.getItem(STORAGE_KEY))
      )
    } else {
      console.warn('localStorage is not available. Using memory as storage')
    }
  }

  save() {
    if (isLocalStorageAvailable()) {
      // save members into local storage
      // value must be json string as local storage only receive string only
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.members));
    }
  }

  add({name, email}) {
    this.members.push(new Member(name, email))
  }

  remove(member) {
    const idx = this.members.indexOf(member)
    if (idx > -1) {
      // assume member still in the list

      // remove it
      this.members.splice(idx, 1)

      // save to localstorage
      this.save()

      return true;
    }
    return false
  }
  get total() {
    return TOTAL_MEMBERS
  }
}
