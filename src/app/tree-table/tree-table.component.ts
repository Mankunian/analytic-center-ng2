/* eslint-disable prettier/prettier */
import { Component, OnInit, Input } from "@angular/core";
import { MessageService, TreeNode } from "primeng/api";
import { HttpService } from "../services/http.service";
import { MatDialog } from "@angular/material/dialog";
import { ReportsModalContentComponent } from "../reports-modal/reports-modal.component";
import {
	SliceOperationsModalComponent,
	SliceOperationsModalContentComponent,
} from "src/app/slice-operations-modal/slice-operations-modal.component";
import { SharedService } from "../services/shared.service";
import { Subscription } from "rxjs";
import { GlobalConfig } from "../../../src/app/global";
import { ErrorHandlerService } from "../services/error-handler.service";
import { FormatGridService } from "../services/format-grid.service";

@Component({
	selector: "app-tree-table",
	templateUrl: "./tree-table.component.html",
	styleUrls: ["./tree-table.component.scss"],
	providers: [SliceOperationsModalComponent],
})

export class TreeTableComponent implements OnInit {
	public STATUS_CODES = GlobalConfig.STATUS_CODES;
	subscription: Subscription;
	terrCode: unknown;
	gridData: TreeNode[];
	cols: any[];
	loader: boolean;
	childrenNode: TreeNode[];
	@Input() checkDeleted: any;
	period: any;
	sliceId: any;
	historyList: Record<string, any>;
	showTimeline: boolean;
	expandedGroupCodes: any;
	expandedGroupCodeList: any = [];
	expandedStatusList: any = [];
	groupCode: any;
	statusCode: any;
	year: any;
	statusData: any;
	tableIndentSize = 15;

	permissionReport: any;
	permissionDelete: any;
	permissionConfirm: any;
	enableGetReportBtn: string;
	enableDeleteSliceBtn: string;
	enableConfirmSliceBtn: string;
	permissionApprove: any;
	enableApproveSliceBtn: string;
	sliceInfo: any;
	percentComplete = 0;
	progressBarList: any;
	eventOnNodeExpand: any;

	constructor(
		// public reportsModalInstance: ReportsModalComponent,
		public dialogOperSlice: MatDialog,
		public reportsModal: MatDialog,
		public dialog: SliceOperationsModalComponent,
		public errorHandler: ErrorHandlerService,
		public shared: SharedService,
		private httpService: HttpService,
		private formatGridService: FormatGridService,
		private sharedService: SharedService,
		public msg: MessageService
	) {
		this.subscription = shared.subjTerrCode$.subscribe(val => {
			this.terrCode = val;
		});

		this.subscription = shared.subjSliceGroupLang$.subscribe(sliceGroup => {
			this.getGridData(sliceGroup);
		});

		this.subscription = shared.subjOrderSliceData$.subscribe(orderSliceList => {
			this.refreshGridTableFromOrder(orderSliceList);
		});

		this.subscription = shared.subjProgressbarWs$.subscribe((data: any) => {
			let progressBarList = JSON.parse(data)
			this.progressBarList = progressBarList;
			this.setPercentValue(progressBarList)
		});

		this.subscription = shared.subjHistoryValue$.subscribe(historyValue => {
			if (historyValue) {
				this.loader = true;
				this.httpService.getSliceGroups().then(
					gridData => {
						this.getGridData(gridData);
						this.loader = false;
					},
					error => {
						this.errorHandler.alertError(error);
					}
				);
			}
		});
	}

	ngOnInit() {
		this.loader = true;
		this.getSliceGroups()

		this.cols = [
			{ field: "name", header: "Группы" },
			{ field: "maxRecNum", header: "На номер" },
			{ field: "completed", header: "Сформирован" },
			{ field: "action", header: "Действие" },
			// { field: "region", header: "По органу" },
			{ field: "percentComplete", header: "Прогресс" },
		];
	}

	getSliceGroups() {
		this.httpService.getSliceGroups().then(gridData => {
			this.getGridData(gridData);
			this.loader = false;
		},
			error => {
				this.errorHandler.alertError(error);
			}
		);
	}

	onNodeExpand(event) {
		this.eventOnNodeExpand = event;
		if (event.node.parent != null) {
			this.loader = true;
			(this.groupCode = event.node.parent.data.code),
				(this.statusCode = event.node.data.code),
				(this.year = event.node.data.statusYear);

			this.httpService.getSlices(this.groupCode, this.statusCode, this.year).then(
				data => {
					this.sliceInfo = data;
					this.checkForProgress()
					event.node.children = this.formatGridService.formatGridData(data, false);
					this.gridData = [...this.gridData]; //refresh the data
					this.loader = false;
				},
				error => {
					this.errorHandler.alertError(error);
				}
			);
		}
	}

	openOperationSliceModal(rowEntity) {
		this.enableDeleteSliceBtn = 'false'
		this.enableConfirmSliceBtn = 'false'
		this.enableApproveSliceBtn = 'false'


		if (sessionStorage.permissionDelete) {
			let permissionDelete = JSON.parse(sessionStorage.getItem('permissionDelete'))
			permissionDelete.forEach(element => {
				if (rowEntity.groupCode == element.code) {
					this.enableDeleteSliceBtn = 'true';
				}
			});
		}
		if (sessionStorage.permissionConfirm) {
			let permissionConfirm = JSON.parse(sessionStorage.getItem('permissionConfirm'))
			permissionConfirm.forEach(element => {
				if (rowEntity.groupCode == element.code) {
					this.enableConfirmSliceBtn = 'true'
				}
			});
		}
		if (sessionStorage.permissionApprove) {
			let permissionApprove = JSON.parse(sessionStorage.getItem('permissionApprove'))
			permissionApprove.forEach(element => {
				if (rowEntity.groupCode == element.code) {
					this.enableApproveSliceBtn = 'true'
				}
			});
		}

		this.period = rowEntity.period;
		this.sliceId = rowEntity.id;
		const dialogRef = this.dialogOperSlice.open(SliceOperationsModalContentComponent, {
			width: "1100px",
			data: {
				sliceId: this.sliceId,
				period: this.period,
				terrCode: this.terrCode,
				statusCode: rowEntity.statusCode,
				permissionDelete: this.enableDeleteSliceBtn,
				permissionConfirm: this.enableConfirmSliceBtn,
				permissionApprove: this.enableApproveSliceBtn
			},
			panelClass: "slice-operations-modal",
		});

		dialogRef.afterOpen().subscribe(() => {
			this.httpService.getHistory(this.sliceId).subscribe(
				data => {
					this.historyList = data;
					this.showTimeline = true;
				},
				error => {
					this.errorHandler.alertError(error);
				}
			);
		});

		dialogRef.afterClosed().subscribe(() => {
			console.log("openOperationSliceModal closed");
		});
	}

	openReportsModal(row) {
		this.enableGetReportBtn = 'false';
		if (sessionStorage.permissionReport) {
			let permissionReport = JSON.parse(sessionStorage.getItem('permissionReport'))
			permissionReport.forEach(element => {
				if (row.groupCode == element.code) {
					this.enableGetReportBtn = 'true';
				}
			});
		}
		const sliceId = row.id;
		const slicePeriod = row.period;
		const sliceGroupCode = row.groupCode;

		if (
			row.statusCode == this.STATUS_CODES.IN_PROCESSING ||
			row.statusCode == this.STATUS_CODES.WAITING_FOR_PROCESSING
		) {
			alert("По данному статусу невозможно получить отчет!");
		} else {
			const reportsModalRef = this.reportsModal.open(ReportsModalContentComponent, {
				disableClose: true,
				data: { sliceId: sliceId, slicePeriod: slicePeriod, groupCode: sliceGroupCode, permissionReport: this.enableGetReportBtn },
				height: "90vh",
				maxHeight: "620px",
				width: "1075px",
				panelClass: "reports-dialog",
			});
			reportsModalRef.afterClosed().subscribe(() => {
				console.log("result");
			});
		}
	}

	refreshGridTableFromOrder(orderSliceList) {
		this.loader = true;
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let self = this;

		setTimeout(() => {
			this.httpService.getSliceGroups().then(
				data => {
					this.getGridData(data);
					orderSliceList.forEach(function (orderListValue) {
						self.gridData.forEach(function (gridValue) {
							if (gridValue.data.code === orderListValue.groupCode) {
								gridValue["expanded"] = true;
								gridValue.children.forEach(function (childValue) {
									if (
										// orderListValue.statusCode == self.STATUS_CODES.WAITING_FOR_PROCESSING && 
										childValue.data.code == self.STATUS_CODES.IN_PROCESSING &&
										childValue.data.statusYear == orderListValue.year
									) {
										// self.loader = true;
										self.httpService
											.getSlices(orderListValue.groupCode, orderListValue.statusCode, orderListValue.year)
											.then(
												data => {
													self.childrenNode = self.formatGridService.formatGridData(data, false);
													childValue.children = self.childrenNode;
													self.gridData = [...self.gridData];
												},
												error => {
													this.errorHandler.alertError(error);
												}
											);
										childValue["expanded"] = true;
									}
								});
								self.gridData = [...self.gridData];
								self.loader = false;
							}
						});
					});
				},
				error => {
					this.errorHandler.alertError(error);
				}
			);
		}, 500);
	}

	refreshGridTable() {
		this.loader = true;
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let self = this;
		this.gridData.forEach(function (parent) {
			if (parent.expanded == true) {
				self.expandedGroupCodeList.push(parent.data);
				parent.children.forEach(function (child) {
					if (child.expanded == true) {
						self.expandedStatusList.push({
							groupCode: child.parent.data.code,
							statusCode: child.data.code,
							statusYear: child.data.statusYear,
						});
					}
				});
			}
		});

		this.httpService.getSliceGroups().then(
			data => {
				console.log(data)
				this.getGridData(data);
				this.gridData.forEach(function (groups, groupKey) {
					self.expandedGroupCodeList.forEach(function (groupValue) {
						if (groups.data.code === groupValue.code) {
							setTimeout(() => {
								self.gridData[groupKey]["expanded"] = true; // Раскрытие групп
								if (self.gridData[groupKey]["expanded"] == true) {
									// Если есть группы которые были раскрыты.
									self.gridData[groupKey].children.forEach(function (childrenValue) {
										// Пробегаемся по каждой группе которые были раскрыты изначально.
										childrenValue.data.groupCode = groupValue.code;
										if (self.expandedStatusList.length > 0) {
											// Если есть раскрытые срезы по СТАТУСАМ
											self.expandedStatusList.forEach(function (element) {
												// Пробегаемся по каждому статусу которые были раскрыты.
												self.statusData = element; // Присваиваем к переменной каждый элемент Статусов.
												if (
													childrenValue.data.code == self.statusData.statusCode &&
													childrenValue.data.statusYear == self.statusData.statusYear &&
													childrenValue.data.groupCode == self.statusData.groupCode
												) {
													// Если статус, группа и год равны то присваиваем expanded
													self.httpService
														.getSlices(
															self.statusData.groupCode,
															self.statusData.statusCode,
															self.statusData.statusYear
														)
														.then(
															data => {
																self.childrenNode = self.formatGridService.formatGridData(data, false);
																childrenValue.children = self.childrenNode;
																self.gridData = [...self.gridData];
															},
															error => {
																this.errorHandler.alertError(error);
															}
														);
													childrenValue["expanded"] = true;
												}
											});
										}
									});
								}
								self.gridData = [...self.gridData];
							}, 2000);
						}
					});
				});
				this.loader = false;
			},
			error => {
				this.errorHandler.alertError(error);
			}
		);
	}

	showDeleted(checkDeleted: boolean) {
		this.sharedService.showDeletedService(checkDeleted);
		this.loader = true;
		this.httpService.getSliceGroups().then(
			gridData => {
				this.getGridData(gridData);
				this.loader = false;
			},
			error => {
				this.errorHandler.alertError(error);
			}
		);
	}

	checkForProgress() {
		this.sliceInfo.forEach(sliceElem => {
			if (this.progressBarList) {
				this.progressBarList.forEach(progressElem => {
					if (sliceElem.id === progressElem.sliceId) {
						sliceElem.percentComplete = progressElem.percent;
						this.eventOnNodeExpand.node.children = this.formatGridService.formatGridData(this.sliceInfo, false);
						this.gridData = [...this.gridData];
					}
				});
			}
		});
	}

	setPercentValue(progressbarList) {
		progressbarList.forEach(progress => {
			if (this.sliceInfo) {
				this.sliceInfo.forEach(slice => {
					if (slice.id === progress.sliceId) {
						slice.percentComplete = progress.percent;
						this.eventOnNodeExpand.node.children = this.formatGridService.formatGridData(this.sliceInfo, false);
						this.gridData = [...this.gridData];
					}
				});
			}
		});
	}

	getGridData(gridData) {
		this.gridData = this.formatGridService.formatGridData(gridData, true, true);
	}


}
