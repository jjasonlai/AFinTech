/** Application Chart options used in Dashboard Overview page  */
export const ApplicationChartOptions = {
	dataLabels: { enabled: !1 },
	labels: ['Success', 'Dropped', 'Pending'],
	colors: ['#754FFE', '#CEC0FF', '#E8E2FF'],
	legend: { position: 'bottom' },
	plotOptions: { pie: { expandOnClick: !1, donut: { size: '78%' } } },
	chart: { type: 'donut' },
	tooltip: { theme: 'light', marker: { show: !0 }, x: { show: !1 } },
	states: { hover: { filter: { type: 'none' } } },
	responsive: [
		{
			breakpoint: 480,
			options: {
				chart: {
					height: 300
				}
			}
		},
		{
			breakpoint: 5000,
			options: {
				chart: {
					height: 280
				}
			}
		}
	]
};

export const ChartData = [
	ApplicationChartOptions,
];

export default ChartData;
