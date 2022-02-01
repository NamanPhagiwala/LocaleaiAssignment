
export default (state = {}, action) => {
	switch (action.type) {
		case 'USER-DATA':
			return {
				userData: action.data
			}
		case 'AREA-DETAILS':
			return {
				areaDetails: action.data
				}
		default:
		return state
	}
}