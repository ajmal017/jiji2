import ContainerJS         from "container-js"
import Observable          from "../../utils/observable"

export default class HomePageModel extends Observable {

  constructor() {
    super();
    this.viewModelFactory = ContainerJS.Inject;
  }

  postCreate() {
    this.tradingSummary =
      this.viewModelFactory.createTradingSummaryViewModel(true);
  }

}
