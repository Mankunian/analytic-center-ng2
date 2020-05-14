import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { HttpService } from "../services/http.service";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TreeNode } from "primeng/api";
import { GlobalConfig } from "../global";
import { ErrorHandlerService } from "../services/error-handler.service";
import { FormatGridService } from "../services/format-grid.service";

@Component({
  selector: "app-reports-modal",
  templateUrl: "./reports-modal.component.html",
  styleUrls: ["./reports-modal.component.scss"],
})
export class ReportsModalComponent {
  constructor(public dialog: MatDialog, private http: HttpService) {}
}

@Component({
  selector: "app-reports-modal-content",
  templateUrl: "./reports-modal-content.component.html",
  styleUrls: ["./reports-modal-content.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ReportsModalContentComponent {
  private BASE_API_URL = GlobalConfig.BASE_API_URL;
  sliceId: any;
  slicePeriod: any;
  reportGroups: any;
  colsDep: any[];
  colsReg: any[];
  colsERSOP: any[];
  selectedGroupCode: any;
  gridData = { deps: [] as any, regs: [] as any, ersop: [] as any };
  childrenNode: TreeNode[];

  requestedReports = { deps: [], regs: [], ersop: [] };
  selectedReportsList: any = [];
  selectedReportsQuery: any = [];
  readyReports: any = [];
  selectAllStatus = { deps: [], regs: [], ersop: [] };
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
  readyReportsParts = 0;
  sliceSize = 2;
  isReportsSelected = false;
  tabIndex = 0;
  contentLoading = false;
  loadingERSOP: boolean;
  isReportsLoading: boolean;
  groupCode: any;
  isGroupERSOP = false;
  gridScrollHeight = "450px";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpService,
    private formatGridService: FormatGridService,
    public errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.contentLoading = true;
    this.sliceId = this.data.sliceId;
    this.slicePeriod = this.data.slicePeriod;
    this.groupCode = this.data.groupCode;

    if (this.groupCode == 100) {
      this.isGroupERSOP = true;
    }

    this.colsDep = [
      { field: "code", header: "И/н", width: "56px" },
      { field: "name", header: "Ведомство", width: "auto" },
    ];

    this.colsReg = [
      { field: "code", header: "И/н", width: "90px" },
      { field: "name", header: "Регион/Орган", width: "auto" },
    ];

    this.colsERSOP = [
      { field: "searchPattern", header: "Код органа", width: "160px" },
      { field: "name", header: "Наименование", width: "auto" },
    ];

    // Get reports list by slice id to genereate tabs
    this.http.getReportsBySliceId(this.sliceId).subscribe(
      reportGroups => {
        this.reportGroups = reportGroups;

        if (this.isGroupERSOP) {
          this.generateGridERSOP();
        } else {
          // Get regions grid data
          this.http.getRegions().subscribe(
            regionsTree => {
              let regionsTreeFormatted = this.formatGridService.formatGridData([regionsTree], true);
              regionsTreeFormatted[0]["expanded"] = true; // Раскрываем первую ветку по умолчанию

              this.reportGroups.forEach(element => {
                let groupCode = element.code;

                // Get department grid data
                this.http.getDepsByReportId(groupCode).subscribe(
                  departments => {
                    this.gridData.deps[groupCode] = this.formatGridService.formatGridData(departments, false);
                    this.requestedReports.deps[groupCode] = [];
                  },
                  error => {
                    this.errorHandler.alertError(error);
                  },
                  () => {
                    console.log(`departments loaded`);
                    this.contentLoading = false;
                  }
                );
                // Assign regions to grid
                this.gridData.regs[groupCode] = regionsTreeFormatted;
                this.requestedReports.regs[groupCode] = [];
              });
            },
            error => {
              this.errorHandler.alertError(error);
            },
            () => {
              console.log(`regions loaded`);
            }
          );
        }
      },
      error => {
        this.errorHandler.alertError(error);
      }
    );
  }

  generateGridERSOP() {
    this.reportGroups.forEach(reportGroup => {
      let groupCode = reportGroup.code;

      this.http.getGroupERSOP().subscribe(
        data => {
          this.gridData.ersop[groupCode] = this.formatGridService.formatGridData(data, true, true);
          this.requestedReports.ersop[groupCode] = [];
        },
        error => {
          this.errorHandler.alertError(error);
        },
        () => {
          this.contentLoading = false;
        }
      );
    });
  }

  onNodeExpandGroupERSOP(event, groupCode) {
    let node = event.node;
    if (!Object.entries(node.children[0].data).length && node.children[0].data.constructor === Object) {
      this.loadingERSOP = true;
      const searchPattern = node.data.searchPattern;

      this.http.getGroupERSOPChildren(searchPattern).then(
        data => {
          event.node.children = this.formatGridService.formatGridData(data, false);
          this.gridData.ersop[groupCode] = [...this.gridData.ersop[groupCode]]; //refresh the data
          this.loadingERSOP = false;
        },
        error => {
          this.errorHandler.alertError(error);
        }
      );
    }
  }

  getReportInfoByCode(groupCode): any {
    if (this.reportGroups != undefined && this.reportGroups) {
      return this.reportGroups.find(item => item.code == groupCode);
    }
  }

  tabChange(index: number) {
    this.tabIndex = index; // current tab index, used in openFirstTab()
    if (this.tabIndex != 0) {
      this.selectedGroupCode = this.reportGroups[this.tabIndex - 1].code;
    } else {
      this.getSelectedReportsList();
    }
  }

  onChangeCheckboxStatus(event, groupCode, selectAllStatus) {
    if (selectAllStatus[groupCode] && !event) {
      selectAllStatus[groupCode] = false;
    }
  }

  selectAllRows(groupCode, requestedReports, gridData, selectAllStatus): void {
    // Clear selected reports list
    requestedReports[groupCode].length = 0;
    // Check status of SelectAll checkbox of current group. True means Select all from this group
    if (selectAllStatus[groupCode]) {
      this.pushSelectedAllRows(groupCode, gridData[groupCode], requestedReports);
    }
    // Update grid data and selected reports list
    gridData = [...gridData];
    requestedReports[groupCode] = [...requestedReports[groupCode]];
  }

  pushSelectedAllRows(groupCode, gridData, requestedReports) {
    gridData.forEach(rowNode => {
      if (rowNode.data && Object.keys(rowNode.data).length === 0) {
        return null;
      }
      if (!rowNode.children) {
        requestedReports[groupCode].push(rowNode.data);
      } else {
        requestedReports[groupCode].push(rowNode.data);
        this.pushSelectedAllRows(groupCode, rowNode.children, requestedReports);
      }
    });
  }

  getSelectedReportsList() {
    let counter = 0;
    this.selectedReportsList = [];

    if (this.requestedReports.ersop != undefined && this.requestedReports.ersop.length > 0) {
      // let self = this
      let reportInfo = this.getReportInfoByCode(this.selectedGroupCode);

      this.requestedReports.ersop[this.selectedGroupCode].forEach(element => {
        this.selectedReportsList[counter] = {
          report: reportInfo,
          region: element,
        };
        this.selectedReportsQuery[counter] = {
          sliceId: this.sliceId,
          reportCode: this.selectedGroupCode,
          govCode: element.searchPattern,
        };
        counter++;
      });
    }

    if (
      this.requestedReports.regs.length > 0 &&
      this.requestedReports.regs.length != undefined &&
      this.requestedReports.deps.length > 0 &&
      this.requestedReports.deps.length != undefined
    ) {
      this.readyReportsParts = 0;

      this.requestedReports.regs.forEach((element, index) => {
        let regionsTabIndex = index;
        let reportInfo = this.getReportInfoByCode(regionsTabIndex);

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let self = this;
        element.forEach(region => {
          if (self.requestedReports.deps[regionsTabIndex] != undefined) {
            self.requestedReports.deps[regionsTabIndex].forEach(department => {
              self.selectedReportsList[counter] = {
                report: reportInfo,
                region: region,
                department: department,
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
    this.selectedReportsList.length > 0 ? (this.isReportsSelected = true) : (this.isReportsSelected = false);
  }

  removeSelectedReport = function(index, selectedReport) {
    this.selectedReportsList.splice(index, 1);
    this.selectedReportsQuery.splice(index, 1);
    let groupCode = selectedReport.report.code;

    if (this.isGroupERSOP) {
      let row = selectedReport.region;

      this.requestedReports.ersop[groupCode].splice(this.requestedReports.ersop[groupCode].indexOf(row), 1);
      this.gridData.ersop[groupCode] = [...this.gridData.ersop[groupCode]];
      this.requestedReports.ersop[groupCode] = [...this.requestedReports.ersop[groupCode]];
    } else {
      let regionCode = selectedReport.region.code,
        departmentCode = selectedReport.department.code;

      if (this.selectedReportsQuery.findIndex(x => x.orgCode === departmentCode) === -1) {
        this.requestedReports.deps[groupCode].splice(this.requestedReports.deps[groupCode].indexOf(departmentCode), 1);
        this.gridData.deps[groupCode].splice(this.gridData.deps[groupCode].indexOf(departmentCode), 1);

        this.requestedReports.deps[groupCode] = [...this.requestedReports.deps[groupCode]];
      }

      if (this.selectedReportsQuery.findIndex(x => x.regCode === regionCode) === -1) {
        this.requestedReports.regs[groupCode].splice(this.requestedReports.regs[groupCode].indexOf(regionCode), 1);
        this.gridData.regs[groupCode].splice(this.gridData.regs[groupCode].indexOf(regionCode), 1);

        this.requestedReports.regs[groupCode] = [...this.requestedReports.regs[groupCode]];
      }
    }
  };

  /*=====  Get reports ======*/
  getReports() {
    let cntr = 0;
    this.readyReportsParts = 0;
    this.readyReports = [];
    this.isReportsLoading = true;
    this.getReportSplices(cntr);
  }
  /*=====  Get reports end ======*/

  getReportSplices(counterFrom) {
    let reportsSlice,
      counterFromIn = counterFrom,
      selectedLang = this.checkLang();
    if (this.selectedReportsQuery != undefined && this.selectedReportsQuery.length > 0) {
      reportsSlice = this.selectedReportsQuery.splice(0, this.sliceSize);
      this.generateReports(reportsSlice, selectedLang, counterFromIn);
    } else {
      this.isReportsLoading = false;
    }
  }
  generateReports(reportsSlice: any, selectedLang, counterFrom) {
    if (reportsSlice.length === 0) {
      return false;
    } else {
      this.http.generateReports(selectedLang, reportsSlice).subscribe(
        data => {
          this.showReports(data);
          counterFrom += 2;
          this.getReportSplices(counterFrom);
        },
        error => {
          this.errorHandler.alertError(error);
        }
      );
    }
  }

  showReports(data) {
    this.readyReportsParts += data.length;
    this.isReportsLoading = false;

    let reportValues = data,
      reportDownloadUrl = "",
      reportDownloadName = "",
      errMsgMissing = "Отсутствует шаблон отчета",
      errMsg = "Ошибка при формировании данного отчета";

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let self = this;
    reportValues.forEach(function(element) {
      if (element.value == -1) {
        reportDownloadUrl = "#";
        reportDownloadName = errMsgMissing;
      } else if (element.value == -2) {
        reportDownloadUrl = "#";
        reportDownloadName = errMsg;
      } else {
        reportDownloadUrl = self.BASE_API_URL + "/reports/" + element.value + "/download";
        reportDownloadName = self.generateReportName(element);
      }

      let readyReportItem = {
        url: reportDownloadUrl,
        name: reportDownloadName,
      };
      self.readyReports.push(readyReportItem);
    });
  }

  generateReportName(element) {
    let delimiter = " - ",
      reportName,
      regionName,
      departmentName,
      groupCode = element.reportCode,
      orgCode = element.orgCode,
      regCode = element.regCode,
      govCode = element.govCode,
      langPostfix = "";

    if (element.lang !== "RU") {
      langPostfix = delimiter + "[" + element.lang + "]";
    }

    let reportInfo = this.getReportInfoByCode(groupCode);
    reportInfo !== undefined ? (reportName = reportInfo.name + delimiter) : (reportName = "");

    if (this.isGroupERSOP === true) {
      let commonIndex = this.requestedReports.ersop[groupCode].findIndex(x => x.searchPattern === govCode);
      commonIndex !== -1 ? (regionName = this.requestedReports.ersop[groupCode][commonIndex].name) : (regionName = "");
    } else {
      let regIndex = this.requestedReports.regs[groupCode].findIndex(x => x.code === regCode);
      regIndex !== -1 ? (regionName = this.requestedReports.regs[groupCode][regIndex].name) : (regionName = "");

      let depIndex = this.requestedReports.deps[groupCode].findIndex(x => x.code === orgCode);
      depIndex !== -1
        ? (departmentName = delimiter + this.requestedReports.deps[groupCode][depIndex].name)
        : (departmentName = "");
    }

    return reportName + regionName + departmentName + langPostfix;
  }

  checkLang() {
    let selectedLang = "";

    if (this.reportLangs.ru.isSelected === false && this.reportLangs.kz.isSelected === false) {
      alert("Выберите язык отчета");
      this.isReportsLoading = false;
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
    this.tabIndex = 0;
  }
}
