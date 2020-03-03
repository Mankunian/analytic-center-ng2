import { Component, Inject } from '@angular/core';
import { HttpService } from '../services/http.service'
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TreeNode } from 'primeng/api';
import { FormatGridDataService } from '../services/format-grid-data.service';
import { FormatGridService } from '../services/format-grid.service';
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
  colsCommon: any[]
  loading: boolean
  loadingReg: boolean
  loadingCommon: boolean
  isReportsLoading: boolean
  tabLoadedData: any = []
  selectedGroupCode: any
  gridDepData: TreeNode[]
  gridDepDataArray: any = []
  gridRegData: TreeNode[]
  gridCommonData: TreeNode[]
  childrenNode: TreeNode[]
  gridRegDataArray: any = []
  gridCommonDataArray: any = []
  selectedRegNodes: TreeNode[]
  selectedRegNodesArray: any = []
  selectedCommonNodes: TreeNode[]
  selectedCommonNodesArray: any = []
  selectedDepNodes: TreeNode[]
  selectedDepNodesArray: any = []
  selectedNodesArray: any = { 'deps': [], 'regs': [], 'common': [] }
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
  contentLoading = false
  groupCode: any;
  isGroupCommon = false
  prevIndex: number
  
  constructor(
    private http: HttpService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formatGridDataService: FormatGridDataService,
    private formatGridService: FormatGridService
    ) { }
  
  ngOnInit() {
    this.contentLoading = true
    this.sliceId = this.data.sliceId
    this.slicePeriod = this.data.slicePeriod
    this.groupCode = this.data.groupCode

    if (this.groupCode == 100) {
      this.isGroupCommon = true
    }

    this.http.getReportsBySliceId(this.sliceId).subscribe((data) => {
      this.reportGroups = data;
      this.contentLoading = false
    })
    
    this.colsDep = [
      { field: 'code', header: 'И/н', width: '100px' },
      { field: 'name', header: 'Ведомство', width: '200px' }
    ];

    this.colsReg = [
      { field: 'code', header: 'И/н', width: '100px' },
      { field: 'name', header: 'Регион/Орган', width: '200px' }
    ];

    this.colsCommon = [
      { field: 'searchPattern', header: 'Код органа', width: '30%' },
      { field: 'name', header: 'Наименование', width: '70%' }
    ];
  }

  getReportInfoByCode(groupCode): any {
    if (this.reportGroups != undefined && this.reportGroups) {
      return this.reportGroups.find(item => item.code == groupCode)
    }
  }

  tabChange(index: number) {
    this.selected = index // current tab index
    if (index != 0) {
      this.selectedGroupCode = this.reportGroups[index - 1].code
      if (! this.tabLoadedData[index]) {
        this.loading = true
        this.loadingReg = true
        
        if (this.isGroupCommon) {
          this.loadingCommon = true
          
          this.http.getGroupCommon().subscribe((data) => {
            this.gridCommonData = this.formatGridService.formatGrid(data, false)['data']
            this.gridCommonDataArray[this.selectedGroupCode] = this.gridCommonData
            this.selectedCommonNodesArray[this.selectedGroupCode] = []
            this.loadingCommon = false
          })
        } else {
          this.http.getDepsByReportId(this.selectedGroupCode).subscribe((data) => {
            this.gridDepData = this.formatGridDataService.formatGridData(data)['data']
            this.gridDepDataArray[this.selectedGroupCode] = this.gridDepData
            this.selectedDepNodesArray[this.selectedGroupCode] = []
            this.loading = false
          })
          
          this.http.getRegions().subscribe((data) => {
            this.gridRegData = this.formatGridDataService.formatGridData([data])['data']
            this.gridRegData[0]['expanded'] = true // Раскрываем первую ветку по умолчанию
            this.gridRegDataArray[this.selectedGroupCode] = this.gridRegData
            this.selectedRegNodesArray[this.selectedGroupCode] = []
            this.loadingReg = false
          })
        }

        this.tabLoadedData[index] = true
      }
    } else {
      this.getSelectedReportsList()
    }
  }

  isRowSelected(rowNode: any, groupCode: any): boolean {
    if (this.selectedRegNodesArray[groupCode] != undefined) {
      return this.selectedRegNodesArray[groupCode].indexOf(rowNode.node.data) >= 0;
    }
  }

  isRowSelectedDep(rowNode: any, groupCode: any): boolean {
    if (this.selectedDepNodesArray[groupCode] != undefined) {
      return this.selectedDepNodesArray[groupCode].indexOf(rowNode.node.data) >= 0;
    }
  }

  isRowSelectedCommon(rowNode: any, groupCode: any): boolean {
    if (this.selectedCommonNodesArray[groupCode] != undefined) {
      return this.selectedCommonNodesArray[groupCode].indexOf(rowNode.node.data) >= 0;
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
  
  toggleRowSelectionDep(rowNode: any, groupCode: any): void {
    if (this.isRowSelectedDep(rowNode, groupCode)) {
      this.selectedDepNodesArray[groupCode].splice(this.selectedDepNodesArray[groupCode].indexOf(rowNode.node.data), 1);
    } else {
      this.selectedDepNodesArray[groupCode].push(rowNode.node.data);
    }
    this.selectedDepNodesArray[groupCode] = [...this.selectedDepNodesArray[groupCode]];
    this.requestedReports.deps = this.selectedDepNodesArray
  }
  
  toggleRowSelectionCommon(rowNode: any, groupCode: any): void {
    if (this.isRowSelectedCommon(rowNode, groupCode)) {
      this.selectedCommonNodesArray[groupCode].splice(this.selectedCommonNodesArray[groupCode].indexOf(rowNode.node.data), 1);
    } else {
      this.selectedCommonNodesArray[groupCode].push(rowNode.node.data);
    }

    this.selectedCommonNodesArray[groupCode] = [...this.selectedCommonNodesArray[groupCode]];
    this.requestedReports.common = this.selectedCommonNodesArray
  }

  onNodeExpandGroupCommon(event) {
    let node = event.node
    if (Object.entries(node.children[0].data).length === 0 && node.children[0].data.constructor === Object) {
      this.loadingCommon = true
      const searchPattern = node.data.searchPattern
      
      this.http.getGroupCommonChildren(searchPattern).then((data) => {
        this.childrenNode = this.formatGridService.formatGrid(data, true)['data']
        node.children = this.childrenNode
        //refresh the data
        this.gridCommonData = [...this.gridCommonData];
        this.loadingCommon = false
      })
    }
  }

  getSelectedReportsList() {
    let counter = 0
    this.selectedReportsList = []

    if (this.requestedReports.common != undefined && this.requestedReports.common.length > 0) {
      let self = this
      let reportInfo = this.getReportInfoByCode(this.selectedGroupCode)

      self.requestedReports.common[this.selectedGroupCode].forEach(function (element, index) {        
        self.selectedReportsList[counter] = {
          report: reportInfo,
          region: element
        }
        self.selectedReportsQuery[counter] = {
          sliceId: self.sliceId,
          reportCode: self.selectedGroupCode,
          govCode: element.searchPattern
        }
        counter++;
      });
    }

    if (
      this.requestedReports.regs.length > 0 && this.requestedReports.regs.length != undefined &&
      this.requestedReports.deps.length > 0 && this.requestedReports.deps.length != undefined
    ) {
      this.readyReportsParts = 0

      this.requestedReports.regs.forEach((element, index) => {
        let regionsTabIndex = index;
        let reportInfo = this.getReportInfoByCode(regionsTabIndex)
        
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let self = this
        element.forEach(region => {
          if (self.requestedReports.deps[regionsTabIndex] != undefined) {
            self.requestedReports.deps[regionsTabIndex].forEach((department) => {
              self.selectedReportsList[counter] = {
                report: reportInfo,
                region: region,
                department: department
              };
              self.selectedReportsQuery[counter] = {
                sliceId: self.sliceId,
                reportCode: reportInfo.code,
                orgCode: department.code,
                regCode: region.code,
              };
              counter++;
            });
          }
        });
      });
    }
    (this.selectedReportsList.length > 0)
      ? this.isReportsSelected = true
      : this.isReportsSelected = false
  }

  removeSelectedReport = function (key, item) {
    this.selectedReportsList.splice(key, 1)
    this.selectedReportsQuery.splice(key, 1)
    let reportCode = item.report.code

    if (this.isGroupCommon) {
      let row = item.region
      
      this.selectedCommonNodesArray[reportCode].splice(this.selectedCommonNodesArray[reportCode].indexOf(row), 1);
      this.selectedCommonNodesArray[reportCode] = [...this.selectedCommonNodesArray[reportCode]];
      this.requestedReports.common = this.selectedCommonNodesArray
    } else {
      let regionCode = item.region.code,
          departmentCode = item.department.code
      
      if (this.selectedReportsQuery.findIndex(x => x.orgCode === departmentCode) === -1) {
        this.selectedDepNodesArray[reportCode].splice(this.selectedDepNodesArray[reportCode].indexOf(regionCode), 1);
        this.selectedDepNodesArray[reportCode] = [...this.selectedDepNodesArray[reportCode]];
        this.requestedReports.deps = this.selectedDepNodesArray
      }

      if (this.selectedReportsQuery.findIndex(x => x.regCode === regionCode) === -1) {
        this.selectedRegNodesArray[reportCode].splice(this.selectedRegNodesArray[reportCode].indexOf(regionCode), 1);
        this.selectedRegNodesArray[reportCode] = [...this.selectedRegNodesArray[reportCode]];
        this.requestedReports.regs = this.selectedRegNodesArray
      }
    }
  };

  getReportSplices(counterFrom) {
    let reportsSlice,
    counterFromIn = counterFrom,
    selectedLang = this.checkLang()
    if (this.selectedReportsQuery != undefined && this.selectedReportsQuery.length > 0) {
      reportsSlice = this.selectedReportsQuery.splice(0, this.sliceSize)
      this.generateReports(reportsSlice, selectedLang, counterFromIn)
    } else {
      this.isReportsLoading = false
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
    this.isReportsLoading = true
    this.getReportSplices(cntr)
  }
  /*=====  Get reports end ======*/
  
  showReports(data, counterFrom) {
    this.readyReportsParts += data.length
    this.isReportsLoading = false
    
    let reportValues = data,
    reportDownloadUrl = "",
    reportDownloadName = "",
    errMsgMissing = "Отсутствует шаблон отчета",
    errMsg = "Ошибка при формировании данного отчета";
    
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let self = this
    reportValues.forEach(function (element, index) {
      if (element.value == -1) {
        reportDownloadUrl = "#";
        reportDownloadName = errMsgMissing;
      } else if (element.value == -2) {
        reportDownloadUrl = "#";
        reportDownloadName = errMsg;
      } else {
        reportDownloadUrl = self.BASE_API_URL + "/reports/" + element.value + "/download";
        reportDownloadName = self.generateReportName(index+counterFrom, element)
      }

      let readyReportItem = {
        url: reportDownloadUrl,
        name: reportDownloadName,
      };
      self.readyReports.push(readyReportItem)
    });
  }

  generateReportName(index: number, element) {    
    if (this.selectedReportsList[index] === undefined) return "false";
    
    let delimiter = ' - ',
      reportName,
      regionName,
      departmentName,
      langPostfix = "";

    if (element.lang !== "RU") {
      langPostfix = delimiter + '[' + element.lang + ']';
    }
    (this.selectedReportsList[index].report.name != undefined) 
      ? reportName = this.selectedReportsList[index].report.name + delimiter 
      : reportName = "";
    (this.selectedReportsList[index].region.name != undefined) 
      ? regionName = this.selectedReportsList[index].region.name 
      : regionName = "";
    (this.selectedReportsList[index].department != undefined) 
      ? departmentName = delimiter + this.selectedReportsList[index].department.name 
      : departmentName = "";

    return reportName + regionName + departmentName + langPostfix;
  }

  checkLang() {
    let selectedLang = "";

    if (this.reportLangs.ru.isSelected === false && this.reportLangs.kz.isSelected === false) {
      alert("Выберите язык отчета");
      this.isReportsLoading = false
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
