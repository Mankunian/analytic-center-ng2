import {Component, Inject} from '@angular/core';
import {HttpService} from '../services/http.service'
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TreeNode } from 'primeng/api';
import { FormatGridDataService } from '../services/format-grid-data.service';
import { GlobalConfig } from '../global';

@Component({
  selector: 'app-reports-modal',
  templateUrl: './reports-modal.component.html',
  styleUrls: ['./reports-modal.component.scss']
})
export class ReportsModalComponent {
  constructor(public dialog: MatDialog, private http: HttpService) { }
}

@Component({
  selector: 'app-reports-modal-content',
  templateUrl: './reports-modal-content.component.html',
  styleUrls: ['./reports-modal-content.component.scss']
})

export class ReportsModalContentComponent {
  
  private BASE_API_URL = GlobalConfig.BASE_API_URL;
  sliceId: any
  slicePeriod: any
  checked_kz = false
  checked_ru = true
  reportGroups: any
  colsDep: any[]
  colsReg: any[]
  loading: boolean
  loadingReg: boolean
  tabLoadedData: any = []
  selectedGroupCode: any
  gridDepData: TreeNode[]
  gridDepDataArray: any = []
  gridRegData: TreeNode[]
  gridRegDataArray: any = []
  selectedRegNodes: TreeNode[]
  selectedRegNodesArray: any = []
  selectedDepNodes: TreeNode[]
  selectedDepNodesArray: any = []
  requestedReports: any = { 'deps': [], 'regs': [] }
  selectedReportsList: any = []
  selectedReportsQuery: any = []
  readyReports: any = []
  reportLangs = {
    ru: {
      name: "Русский",
      langCode: "ru",
      isSelected: true,
      isInterfaceLang: false,
    },
    kz: {
      name: "Казахский",
      langCode: "kz",
      isSelected: false,
      isInterfaceLang: false,
    },
  };
  reportsLoading: boolean;
  readyReportsTotal = 0;
  readyReportsParts = 0;
  sliceSize = 2;
  isReportsSelected = false
  selected = 0
  showGetReportsBtn = false
  
  constructor(
    private http: HttpService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formatGridDataService: FormatGridDataService
  ) { }
  
  ngOnInit() {
    this.sliceId = this.data.sliceId
    this.slicePeriod = this.data.slicePeriod

    this.http.getReportsBySliceId(this.sliceId).subscribe((data) => {
      this.reportGroups = data;
    })
    
    this.colsDep = [
      { field: 'code', header: 'И/н', width: '100px' },
      { field: 'name', header: 'Ведомство', width: '200px' }
    ];

    this.colsReg = [
      { field: 'code', header: 'И/н', width: '100px' },
      { field: 'name', header: 'Регион/Орган', width: '200px' }
    ];
  }

  getReportInfoByCode(groupCode): any {
    if (this.reportGroups != undefined && this.reportGroups) {
      return this.reportGroups.find(item => item.code == groupCode)
    }
  }

  tabChange(index: number) {
    this.selected = index
    console.log("TCL: ReportsModalContentComponent -> tabChange -> this.selected", this.selected)
    
    if (index != 0) {
      this.selectedGroupCode = this.reportGroups[index - 1].code
      if (!this.tabLoadedData[index]) {
        this.loading = true
        this.loadingReg = true

        this.http.getDepsByReportId(this.selectedGroupCode).subscribe((data) => {
          this.gridDepData = this.formatGridDataService.formatGridData(data)['data']
          this.gridDepDataArray[this.selectedGroupCode] = this.gridDepData
          this.loading = false
        })
        
        this.http.getRegions().subscribe((data) => {
          this.gridRegData = this.formatGridDataService.formatGridData([data])['data']
          this.gridRegData[0]['expanded'] = true // Раскрываем первую ветку по умолчанию
          this.gridRegDataArray[this.selectedGroupCode] = this.gridRegData
          this.selectedRegNodesArray[this.selectedGroupCode] = []
          this.loadingReg = false
        })
        this.tabLoadedData[index] = true
      }
    } else {
      this.getSelectedReportsList()
    }
  }

  nodeSelect(event, code) {
    this.requestedReports.deps = this.selectedDepNodesArray
  }
  nodeUnselect(event, code) {
  }
  nodeRegSelect(event, code) {
    this.requestedReports.regs = this.selectedRegNodesArray
  }
  nodeRegUnselect(event, code) {
  }
  onNodeExpand(event) {
  }
  isRowSelected(rowNode: any, groupCode: any): boolean {
    if (this.selectedRegNodesArray[groupCode] != undefined) {
      return this.selectedRegNodesArray[groupCode].indexOf(rowNode.node.data) >= 0;
    }
  }
  
  toggleRowSelection(rowNode: any, groupCode: any): void {
    if (this.isRowSelected(rowNode, groupCode)) {
      this.selectedRegNodesArray[groupCode].splice(this.selectedRegNodesArray[groupCode].indexOf(rowNode.node.data), 1);
    } else {
      this.selectedRegNodesArray[groupCode].push(rowNode.node.data);
    }
    this.selectedRegNodesArray[groupCode] = [...this.selectedRegNodesArray[groupCode]];
    this.requestedReports.regs = this.selectedRegNodesArray
  }

  getSelectedReportsList() {
    let counter = 0
    this.selectedReportsList = []

    if (
      this.requestedReports.regs.length > 0 &&
      this.requestedReports.regs.length != undefined &&
      this.requestedReports.deps.length > 0 &&
      this.requestedReports.deps.length != undefined
    ) {
      this.readyReportsParts = 0

      this.requestedReports.regs.forEach((element, index) => {
        let regionsTabIndex = index;
        let reportInfo = this.getReportInfoByCode(regionsTabIndex)
        
        element.forEach(region => {
          if (this.requestedReports.deps[regionsTabIndex] != undefined) {
            this.requestedReports.deps[regionsTabIndex].forEach((department) => {
              this.selectedReportsList[counter] = {
                report: reportInfo,
                region: region,
                department: department
              };
              this.selectedReportsQuery[counter] = {
                sliceId: this.sliceId,
                reportCode: reportInfo.code,
                orgCode: department.data.code,
                regCode: region.code,
              };
              counter++;
            });
          }
        });
      });
    }
    if (this.selectedReportsList.length > 0) this.isReportsSelected = true
  }

  removeSelectedReport = function (key, item) {
    this.selectedReportsList.splice(key, 1)
    this.selectedReportsQuery.splice(key, 1)

    let reportCode = item.report.code,
      regionCode = item.region.code,
      departmentCode = item.department.data.code

    if (this.selectedReportsQuery.findIndex(x => x.orgCode === departmentCode) === -1) {
      let index = this.selectedDepNodesArray[reportCode].findIndex(item => item.data.code === departmentCode)
      this.selectedDepNodesArray[reportCode].splice(index, 1)
      this.gridDepDataArray[reportCode] = [...this.gridDepDataArray[reportCode]]
    }

    if (this.selectedReportsQuery.findIndex(x => x.regCode === regionCode) === -1) {
      let indexReg = this.selectedRegNodesArray[reportCode].findIndex(item => item.code === regionCode)
      this.selectedRegNodesArray[reportCode].splice(indexReg, 1)
      this.selectedRegNodesArray[reportCode] = [...this.selectedRegNodesArray[reportCode]]
      this.requestedReports.regs = this.selectedRegNodesArray
    }
  };

  getReportSplices(counterFrom) {
    let reportsSlice,
    counterFromIn = counterFrom,
    selectedLang = this.checkLang()
    
    if (this.selectedReportsQuery != undefined && this.selectedReportsQuery.length > 0) {
      reportsSlice = this.selectedReportsQuery.splice(0, this.sliceSize)
      this.generateReports(reportsSlice, selectedLang, counterFromIn)
    }
  }
  generateReports(reportsSlice: any, selectedLang, counterFrom) {
    if (reportsSlice.length === 0) {
      return false
    } else {
      this.http.generateReports(selectedLang, reportsSlice).subscribe((data) => {
        this.showReports(data, counterFrom);
        counterFrom += 2
        this.getReportSplices(counterFrom)
      })
    }
  }
  
	/*=====  Get reports ======*/
  getReports() {
    let cntr = 0
    this.readyReportsParts = 0
    this.readyReportsTotal = 0
    this.readyReports = []
    this.getReportSplices(cntr)
  }
  /*=====  Get reports end ======*/
  
  showReports(data, counterFrom) {
    this.readyReportsParts += data.length
    console.log("TCL: ReportsModalContentComponent -> showReports -> data.length", data.length)
    console.log("TCL: ReportsModalContentComponent -> showReports -> this.readyReportsParts", this.readyReportsParts)
    // this.readyReportsTotal = this.selectedReportsList.length
    let reportValues = data,
      counter = counterFrom,
      counterKz = counterFrom,
      reportDownloadUrl = "",
      reportDownloadName = "",
      reportErrMsgMissing = "Отсутствует шаблон отчета",
      reportErrMsg = "Ошибка при формировании данного отчета";

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let self = this
    reportValues.forEach(function (element) {
      if (element.value == -1) {
        reportDownloadUrl = "#";
        reportDownloadName = reportErrMsgMissing;
      } else if (element.value == -2) {
        console.error(element.errMsg);
        reportDownloadUrl = "#";
        reportDownloadName = reportErrMsg;
      } else {
        if (element.lang === "RU") {
          reportDownloadUrl = self.BASE_API_URL+"/reports/" + element.value + "/download";
          reportDownloadName = self.selectedReportsList[counter].report.name + ' - '
            + self.selectedReportsList[counter].region.name + ' - '
            + self.selectedReportsList[counter].department.data.name
          counter++;
        } else if (element.lang === "KZ") {
          reportDownloadUrl = self.BASE_API_URL+"/reports/" + element.value + "/download";
          reportDownloadName = self.selectedReportsList[counterKz] + " - [kaz]";
          counterKz++;
        }
      }

      let readyReportItem = {
        url: reportDownloadUrl,
        name: reportDownloadName,
      };
      self.readyReports.push(readyReportItem);
    });
  }

  checkLang() {
    let selectedLang = "";

    if (this.reportLangs.ru.isSelected === false && this.reportLangs.kz.isSelected === false) {
      alert("Выберите язык отчета");
      return false;
    }

    if (this.reportLangs.ru.isSelected === true && this.reportLangs.kz.isSelected === true) {
      selectedLang = "all";
    } else if (this.reportLangs.kz.isSelected === true) {
      selectedLang = "kz";
    } else if (this.reportLangs.ru.isSelected === true) {
      selectedLang = "ru";
    }

    return selectedLang;
  }

  openFirstTab() {
    this.selected = (0)
  }
}