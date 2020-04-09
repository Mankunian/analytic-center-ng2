import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { HttpService } from '../services/http.service'
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TreeNode } from 'primeng/api';
import { FormatGridDataService } from '../services/format-grid-data.service';
import { FormatGridService } from '../services/format-grid.service';
import { GlobalConfig } from '../global';
import { ErrorHandlerService } from '../services/error-handler.service';

@Component({
	selector: 'app-reports-modal',
	templateUrl: './reports-modal.component.html',
	styleUrls: ['./reports-modal.component.scss']
})
export class ReportsModalComponent {
  constructor(
    public dialog: MatDialog,
    private http: HttpService
  ) { }
}

@Component({
	selector: 'app-reports-modal-content',
	templateUrl: './reports-modal-content.component.html',
	styleUrls: ['./reports-modal-content.component.scss'],
	encapsulation: ViewEncapsulation.None,
})

export class ReportsModalContentComponent {
	private BASE_API_URL = GlobalConfig.BASE_API_URL;
	sliceId: any
	slicePeriod: any
	reportGroups: any
	colsDep: any[]
	colsReg: any[]
	colsCommon: any[]
  selectedGroupCode: any
  
  childrenNode: TreeNode[]
  
  gridData = { 'deps': [] as any, 'regs': [] as any, 'common': [] as any }
	gridDepDataArray: any = []
  gridRegDataArray: any = []
	gridCommonDataArray: any = []
  
	requestedReports = { 'deps': [], 'regs': [], 'common': [] }
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
	readyReportsParts = 0;
	sliceSize = 2;
	isReportsSelected = false
	selected = 0
  contentLoading = false
  loadingCommon: boolean
  isReportsLoading: boolean
	groupCode: any;
  isGroupCommon = false

	constructor(
		private http: HttpService,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private formatGridDataService: FormatGridDataService,
    private formatGridService: FormatGridService,
    public errorHandler: ErrorHandlerService
	) { }

	ngOnInit() {
		this.contentLoading = true
		this.sliceId = this.data.sliceId
		this.slicePeriod = this.data.slicePeriod
		this.groupCode = this.data.groupCode

		if (this.groupCode == 100) {
			this.isGroupCommon = true
		}

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

    this.http.getReportsBySliceId(this.sliceId).subscribe(
      (data) => {
        this.reportGroups = data;

        if (this.isGroupCommon) {
          this.reportGroups.forEach(element => {
            let groupCode = element.code
            this.http.getGroupCommon().subscribe(
              (data) => {
                this.gridData.common[groupCode] = this.formatGridService.formatGrid(data, false)['data']
              },
              error => {
                this.errorHandler.alertError(error)
              }
            )
          });
          this.contentLoading = false
        } else {
          this.reportGroups.forEach(element => {
            let groupCode = element.code
            this.http.getDepsByReportId(groupCode).subscribe(
              (data) => {
                this.gridData.deps[groupCode] = this.formatGridDataService.formatGridData(data)['data']
              },
              error => {
                this.errorHandler.alertError(error)
              }
            )
            this.http.getRegions().subscribe(
              (data) => {
                this.gridData.regs[groupCode] = this.formatGridDataService.formatGridData([data])['data']
                this.gridData.regs[groupCode][0]['expanded'] = true // Раскрываем первую ветку по умолчанию
              },
              error => {
                this.errorHandler.alertError(error)
              }
            )
          });
        }

        this.contentLoading = false
      },
      error => {
        this.errorHandler.alertError(error)
      }
    )
	}

	getReportInfoByCode(groupCode): any {
		if (this.reportGroups != undefined && this.reportGroups) {
			return this.reportGroups.find(item => item.code == groupCode)
		}
	}

	tabChange(index: number) {
		this.selected = index // current tab index, used in openFirstTab()
		if (this.selected != 0) {
			this.selectedGroupCode = this.reportGroups[this.selected - 1].code
		} else {
			this.getSelectedReportsList()
		}
	}
  
  selectAllRows(groupCode: any): void {
    console.log("ReportsModalContentComponent -> selectAllRows -> groupCode", groupCode)
  }

	onNodeExpandGroupCommon(event) {
		let node = event.node
		if (Object.entries(node.children[0].data).length === 0 && node.children[0].data.constructor === Object) {
			this.loadingCommon = true
			const searchPattern = node.data.searchPattern

      this.http.getGroupCommonChildren(searchPattern).then(
        (data) => {
          this.childrenNode = this.formatGridService.formatGrid(data, true)['data']
          node.children = this.childrenNode
          this.gridData.common = [...this.gridData.common]; //refresh the data
          this.loadingCommon = false
        },
        error => {
          this.errorHandler.alertError(error)
        }
      )
		}
	}

	getSelectedReportsList() {
		let counter = 0
		this.selectedReportsList = []

		if (this.requestedReports.common != undefined && this.requestedReports.common.length > 0) {
			// let self = this
			let reportInfo = this.getReportInfoByCode(this.selectedGroupCode)

			this.requestedReports.common[this.selectedGroupCode].forEach( (element) => {
				this.selectedReportsList[counter] = {
					report: reportInfo,
					region: element
				}
				this.selectedReportsQuery[counter] = {
					sliceId: this.sliceId,
					reportCode: this.selectedGroupCode,
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
		let groupCode = item.report.code

		if (this.isGroupCommon) {
			let row = item.region

			this.requestedReports.common[groupCode].splice(this.requestedReports.common[groupCode].indexOf(row), 1);
			this.requestedReports.common[groupCode] = [...this.requestedReports.common[groupCode]];
		} else {
			let regionCode = item.region.code,
				departmentCode = item.department.code

			if (this.selectedReportsQuery.findIndex(x => x.orgCode === departmentCode) === -1) {
				this.requestedReports.deps[groupCode].splice(this.requestedReports.deps[groupCode].indexOf(regionCode), 1);
				this.requestedReports.deps[groupCode] = [...this.requestedReports.deps[groupCode]];
			}

			if (this.selectedReportsQuery.findIndex(x => x.regCode === regionCode) === -1) {
				this.requestedReports.regs[groupCode].splice(this.requestedReports.regs[groupCode].indexOf(regionCode), 1);
				this.requestedReports.regs[groupCode] = [...this.requestedReports.regs[groupCode]];
			}
		}
	};

	/*=====  Get reports ======*/
	getReports() {
		let cntr = 0
		this.readyReportsParts = 0
		this.readyReports = []
		this.isReportsLoading = true
		this.getReportSplices(cntr)
	}
	/*=====  Get reports end ======*/

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
      this.http.generateReports(selectedLang, reportsSlice).subscribe(
        (data) => {
          this.showReports(data);
          counterFrom += 2
          this.getReportSplices(counterFrom)
        },
        error => {
          this.errorHandler.alertError(error)
        }
      )
		}
	}

	showReports(data) {
		this.readyReportsParts += data.length
		this.isReportsLoading = false

		let reportValues = data,
			reportDownloadUrl = "",
			reportDownloadName = "",
			errMsgMissing = "Отсутствует шаблон отчета",
			errMsg = "Ошибка при формировании данного отчета";

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let self = this
		reportValues.forEach(function (element) {
			if (element.value == -1) {
				reportDownloadUrl = "#";
				reportDownloadName = errMsgMissing;
			} else if (element.value == -2) {
				reportDownloadUrl = "#";
				reportDownloadName = errMsg;
			} else {
				reportDownloadUrl = self.BASE_API_URL + "/reports/" + element.value + "/download";
				reportDownloadName = self.generateReportName(element)
			}

			let readyReportItem = {
				url: reportDownloadUrl,
				name: reportDownloadName,
			};
			self.readyReports.push(readyReportItem)
		});
	}

	generateReportName(element) {
		let delimiter = ' - ',
			reportName,
			regionName,
			departmentName,
			groupCode = element.reportCode,
			orgCode = element.orgCode,
			regCode = element.regCode,
			govCode = element.govCode,
			langPostfix = "";

		if (element.lang !== "RU") {
			langPostfix = delimiter + '[' + element.lang + ']';
		}

		let reportInfo = this.getReportInfoByCode(groupCode);
		(reportInfo !== undefined)
			? reportName = reportInfo.name + delimiter
			: reportName = "";

		if (this.isGroupCommon === true) {
			let commonIndex = this.requestedReports.common[groupCode].findIndex(x => x.searchPattern === govCode);
			(commonIndex !== -1)
				? regionName = this.requestedReports.common[groupCode][commonIndex].name
				: regionName = "";
		} else {
			let regIndex = this.requestedReports.regs[groupCode].findIndex(x => x.code === regCode);
			(regIndex !== -1)
				? regionName = this.requestedReports.regs[groupCode][regIndex].name
				: regionName = "";

			let depIndex = this.requestedReports.deps[groupCode].findIndex(x => x.code === orgCode);
			(depIndex !== -1)
				? departmentName = delimiter + this.requestedReports.deps[groupCode][depIndex].name
				: departmentName = "";
		}

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
