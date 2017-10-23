//***************************************************************************
// Class:       TTTView
// Description: Handles rendering of game in canvas, button presses, and
//              clicks in game area.  Sets up jquery event handlers for   
//              click events, and provides methods for updating UI. 
//
//              When a UI item is clicked, the click handler extracts the 
//              'clickID' attribute from the event target (all clickable HTML 
//              elements must have this attribute assigned), and passes it as 
//              a param to the m_fnBtnClickCallback function provided when the 
//              instance was created.
//
//              When the clicks on the canvas during game play, the click is
//              translated into row/column pair if possible.  If valid, then
//              this row/column pair are used as parameters to the function
//              m_fnGameBoardClickCallback.
// Author:      Brian Denton
// Date:        9/6/2017
//***************************************************************************
var TTTView = function (fnBtnClickCallback, fnGameBoardClickCallback) {
    // Private constants
    const A = 10000;    //arc
    const BCT = 10001;  //bezierCurveTo
    const BP = 10002;   //beginPath
    const F = 10003;    //fill
    const FS = 10004;   //fillStyle
    const LC = 10005;   //lineCap
    const LT = 10006;   //lineTo
    const LW = 10007;   //lineWidth
    const MT = 10008;   //moveTo
    const S = 10009;    //stroke
    const SS = 10010;   //strokeStyle

    // Draw Data for toads, x/o markings, and lilipads
    var m_oToadData = [
        SS, 0, FS, 0, LW, 4, LC, "round", BP,   //Front left leg (upper)
        MT, -90.5, -105.5,
        BCT, -113.5, -96.5, -127.5, -97.5, -155.5, -102.5,
        BCT, -192.5, -99.5, -192.5, -53.5, -161.5, -50.5,
        BCT, -135.5, -45.5, -116.5, -48.5, -95.5, -39.5,
        F, S,
        SS, 1, FS, 2, LW, 5, BP,
        MT, -90.5, -101.5,
        BCT, -113.5, -91.5, -123.5, -93.5, -147.5, -98.5,
        BCT, -192.5, -103.5, -188.5, -54.5, -157.5, -54.5,
        BCT, -135.5, -49.5, -112.5, -52.5, -91.5, -41.5,
        F, S,
        SS, 0, FS, 0, LW, 4, BP,   //Front right let (upper)
        MT, 90.5, -105.5,
        BCT, 113.5, -96.5, 127.5, -97.5, 155.5, -102.5,
        BCT, 192.5, -99.5, 192.5, -53.5, 161.5, -50.5,
        BCT, 135.5, -45.5, 116.5, -48.5, 95.5, -39.5,
        F, S,
        SS, 1, FS, 2, LW, 5, BP,
        MT, 90.5, -101.5,
        BCT, 113.5, -91.5, 123.5, -93.5, 147.5, -98.5,
        BCT, 192.5, -103.5, 188.5, -54.5, 157.5, -54.5,
        BCT, 135.5, -49.5, 112.5, -52.5, 91.5, -41.5,
        F, S,
        SS, 0, FS, 0, LW, 4, BP,   //Front left leg (lower) and foot
        MT, -147.5, -100.5,
        BCT, -160.5, -103.5, -165.5, -117.5, -166.5, -124.5,
        BCT, -169.5, -133.5, -148.5, -133.5, -151.5, -144.5,
        BCT, -160.5, -152.5, -161.5, -136.5, -177.5, -139.5,
        BCT, -184.5, -140.5, -193.5, -196.5, -203.5, -196.5,
        BCT, -211.5, -196.5, -193.5, -163.5, -202.5, -156.5,
        BCT, -207.5, -152.5, -219.5, -176.5, -227.5, -170.5,
        BCT, -232.5, -163.5, -213.5, -157.5, -211.5, -146.5,
        BCT, -208.5, -135.5, -194.5, -79.5, -183.5, -67.5,
        F, S,
        SS, 1, FS, 2, LW, 5, BP,
        MT, -148.5, -98.5,
        BCT, -162.5, -99.5, -167.5, -113.5, -172.5, -124.5,
        BCT, -171.5, -131.5, -151.5, -138.5, -154.5, -142.5,
        BCT, -160.5, -148.5, -161.5, -132.5, -179.5, -135.5,
        BCT, -187.5, -136.5, -194.5, -182.5, -201.5, -189.5,
        BCT, -202.5, -182.5, -193.5, -159.5, -200.5, -152.5,
        BCT, -207.5, -148.5, -219.5, -172.5, -225.5, -166.5,
        BCT, -227.5, -167.5, -209.5, -157.5, -207.5, -146.5,
        BCT, -206.5, -139.5, -192.5, -83.5, -179.5, -69.5,
        F, S,
        SS, 0, FS, 0, LW, 4, BP,   //Front right leg (lower) and foot
        MT, 147.5, -100.5,
        BCT, 160.5, -103.5, 165.5, -117.5, 166.5, -124.5,
        BCT, 169.5, -133.5, 148.5, -133.5, 151.5, -144.5,
        BCT, 160.5, -152.5, 161.5, -136.5, 177.5, -139.5,
        BCT, 184.5, -140.5, 193.5, -196.5, 203.5, -196.5,
        BCT, 211.5, -196.5, 193.5, -163.5, 202.5, -156.5,
        BCT, 207.5, -152.5, 219.5, -176.5, 227.5, -170.5,
        BCT, 232.5, -163.5, 213.5, -157.5, 211.5, -146.5,
        BCT, 208.5, -135.5, 194.5, -79.5, 183.5, -67.5,
        F, S,
        SS, 1, FS, 2, LW, 5, BP,
        MT, 148.5, -98.5,
        BCT, 162.5, -99.5, 167.5, -113.5, 172.5, -124.5,
        BCT, 171.5, -131.5, 151.5, -138.5, 154.5, -142.5,
        BCT, 160.5, -148.5, 161.5, -132.5, 179.5, -135.5,
        BCT, 187.5, -136.5, 194.5, -182.5, 201.5, -189.5,
        BCT, 202.5, -182.5, 193.5, -159.5, 200.5, -152.5,
        BCT, 207.5, -148.5, 219.5, -172.5, 225.5, -166.5,
        BCT, 227.5, -167.5, 209.5, -157.5, 207.5, -146.5,
        BCT, 206.5, -139.5, 192.5, -83.5, 179.5, -69.5,
        F, S,
        SS, 0, FS, 0, LW, 4, BP,   //Back left leg (upper)
        MT, -1, 110.5,
        BCT, -45.5, 92.5, -75.5, 78.5, -143.5, 96.5,
        BCT, -160.5, 101.5, -167.5, 120.5, -156.5, 139.5,
        BCT, -107.5, 170.5, -64.5, 175.5, -1, 190.5,
        F, S,
        SS, 1, FS, 2, LW, 5, BP,
        MT, 0, 112.5,
        BCT, -45.5, 97.5, -75.5, 81.5, -140.5, 98.5,
        BCT, -157.5, 101.5, -164.5, 120.5, -153.5, 139.5,
        BCT, -107.5, 167.5, -64.5, 172.5, 0, 187.5,
        F, S,
        SS, 0, FS, 0, LW, 4, BP,   //Back right leg (upper)
        MT, 0.5, 110.5,
        BCT, 45.5, 92.5, 75.5, 78.5, 143.5, 96.5,
        BCT, 160.5, 101.5, 167.5, 120.5, 156.5, 139.5,
        BCT, 107.5, 170.5, 64.5, 175.5, 0.5, 190.5,
        F, S,
        SS, 1, FS, 2, LW, 5, BP,
        MT, 0, 112.5,
        BCT, 45.5, 97.5, 75.5, 81.5, 140.5, 98.5,
        BCT, 157.5, 101.5, 164.5, 120.5, 153.5, 137.5,
        BCT, 107.5, 167.5, 64.5, 172.5, 0, 187.5,
        F, S,
        SS, 0, FS, 0, LW, 4, BP,   //Body
        MT, -12.5, -204.5,
        BCT, 0, -208.5, 0, -208.5, 11.5, -204.5,
        BCT, 65.5, -186.5, 103.5, -136.5, 101.5, -119.5,
        BCT, 106.5, -96.5, 121.5, -61.5, 122.5, 24.5,
        BCT, 119.5, 108.5, 45.5, 126.5, 15.5, 183.5,
        BCT, 0, 192.5, 0, 192.5, -16.5, 183.5,
        BCT, -45.5, 126.5, -119.5, 108.5, -122.5, 24.5,
        BCT, -121.5, -61.5, -106.5, -96.5, -101.5, -119.5,
        BCT, -103.5, -136.5, -65.5, -186.5, -12.5, -204.5,
        F, S,
        SS, 1, FS, 2, LW, 5, BP,
        MT, -10.5, -200.5,
        BCT, 0, -204.5, 0, -204.5, 10.5, -200.5,
        BCT, 65.5, -181.5, 103.5, -131.5, 97.5, -113.5,
        BCT, 104.5, -87.5, 118.5, -61.5, 118.5, 24.5,
        BCT, 115.5, 108.5, 41.5, 126.5, 12.5, 181.5,
        BCT, 0, 188.5, 0, 188.5, -12.5, 181.5,
        BCT, -41.5, 126.5, -115.5, 108.5, -118.5, 24.5,
        BCT, -118.5, -61.5, -104.5, -87.5, -97.5, -113.5,
        BCT, -103.5, -131.5, -65.5, -181.5, -10.5, -200.5,
        F, S,
        SS, 3, FS, 4, BP,          //Eyes
        MT, 44.5, -163,
        BCT, 67.5, -166.5, 82.5, -150.5, 73, -125,
        F, S,
        BP, MT, -44.5, -163,
        BCT, -67.5, -166.5, -82.5, -150.5, -73, -125,
        F, S,
        SS, 1, FS, 2, LW, 3, BP,   //Eye ridges
        MT, 36.5, -166.5,
        BCT, 57.5, -156.5, 71, -138, 74.5, -117.5,
        F, S,
        BP, MT, -36.5, -166.5,
        BCT, -57.5, -156.5, -71, -138, -74.5, -117.5,
        F, S,
        SS, 4, FS, 4, BP,          //Nostrils
        A, 12.5, -187.5, 3, 0, 2 * Math.PI,
        F,
        BP,
        A, -12.5, -187.5, 3, 0, 2 * Math.PI,
        F,
        SS, 0, FS, 0, LW, 4, BP,   //Back left leg (lower)
        MT, -131.5, 110.5,
        BCT, -91.5, 119.5, -43.5, 141.5, -22.5, 162.5,
        BCT, -1, 181.5, -5.5, 207.5, -35.5, 204.5,
        BCT, -88.5, 191.5, -108.5, 181.5, -149.5, 143.5,
        F, S,
        SS, 1, FS, 2, LW, 6, BP,
        MT, -135.5, 112.5,
        BCT, -91.5, 122.5, -37.5, 145.5, -19.5, 168.5,
        BCT, -7.5, 184.5, -12.5, 204.5, -33.5, 200.5,
        BCT, -91.5, 188.5, -108.5, 178.5, -150.5, 137.5,
        F, S,
        SS, 0, FS, 0, LW, 4, BP,   //Back rigth leg (lower)
        MT, 131.5, 110.5,
        BCT, 91.5, 119.5, 43.5, 141.5, 22.5, 162.5,
        BCT, 0.5, 181.5, 5.5, 207.5, 35.5, 204.5,
        BCT, 88.5, 191.5, 108.5, 181.5, 149.5, 143.5,
        F, S,
        SS, 1, FS, 2, LW, 6, BP,
        MT, 135.5, 112.5,
        BCT, 91.5, 122.5, 46.5, 145.5, 19.5, 168.5,
        BCT, 7.5, 184.5, 12.5, 204.5, 33.5, 200.5,
        BCT, 91.5, 188.5, 108.5, 178.5, 150.5, 137.5,
        F, S,
        SS, 0, FS, 0, LW, 4, BP,   //Back left foot
        MT, -39.5, 176.5,
        BCT, -62.5, 168.5, -78.5, 171.5, -107.5, 163.5,
        BCT, -174.5, 141.5, -175.5, 113.5, -184.5, 124.5,
        BCT, -186.5, 133.5, -183.5, 129.5, -189.5, 135.5,
        BCT, -202.5, 141.5, -231.5, 128.5, -240.5, 136.5,
        BCT, -237.5, 150.5, -203.5, 146.5, -195.5, 166.5,
        BCT, -193.5, 175.5, -203.5, 174.5, -195.5, 181.5,
        BCT, -146.5, 177.5, -137.5, 182.5, -116.5, 188.5,
        BCT, -89.5, 204.5, -45.5, 204.5, -40.5, 203.5,
        F, S,
        SS, 1, FS, 2, LW, 6, BP,
        MT, -38.5, 180.5,
        BCT, -62.5, 172.5, -78.5, 175.5, -107.5, 167.5,
        BCT, -180.5, 147.5, -173.5, 110.5, -184.5, 130.5,
        BCT, -182.5, 134.5, -185.5, 137.5, -185.5, 137.5,
        BCT, -198.5, 145.5, -227.5, 132.5, -236.5, 136.5,
        BCT, -233.5, 148.5, -199.5, 144.5, -191.5, 164.5,
        BCT, -189.5, 171.5, -199.5, 170.5, -191.5, 178.5,
        BCT, -146.5, 173.5, -137.5, 178.5, -116.5, 184.5,
        BCT, -89.5, 200.5, -45.5, 200.5, -40.5, 199.5,
        F, S,
        SS, 0, FS, 0, LW, 4, BP,   //Back right foot
        MT, 39.5, 176.5,
        BCT, 62.5, 168.5, 78.5, 171.5, 107.5, 163.5,
        BCT, 174.5, 141.5, 175.5, 113.5, 184.5, 124.5,
        BCT, 186.5, 133.5, 183.5, 129.5, 189.5, 135.5,
        BCT, 202.5, 141.5, 231.5, 128.5, 240.5, 136.5,
        BCT, 237.5, 150.5, 203.5, 146.5, 195.5, 166.5,
        BCT, 193.5, 175.5, 203.5, 174.5, 195.5, 181.5,
        BCT, 146.5, 177.5, 137.5, 182.5, 116.5, 188.5,
        BCT, 89.5, 204.5, 45.5, 204.5, 40.5, 203.5,
        F, S,
        SS, 1, FS, 2, LW, 6, BP,
        MT, 38.5, 180.5,
        BCT, 62.5, 172.5, 78.5, 175.5, 107.5, 167.5,
        BCT, 180.5, 147.5, 173.5, 110.5, 184.5, 130.5,
        BCT, 182.5, 134.5, 185.5, 137.5, 185.5, 137.5,
        BCT, 198.5, 145.5, 227.5, 132.5, 236.5, 136.5,
        BCT, 233.5, 148.5, 199.5, 144.5, 191.5, 164.5,
        BCT, 189.5, 171.5, 199.5, 170.5, 191.5, 178.5,
        BCT, 146.5, 173.5, 137.5, 178.5, 116.5, 184.5,
        BCT, 89.5, 200.5, 45.5, 200.5, 40.5, 199.5,
        F, S,
        SS, 1, FS, 1, LW, 2, BP,   //Web details
        MT, -181.5, 126.5,
        LT, -177.5, 141.5,
        LT, -195.5, 141.5,
        F, S, BP,
        MT, -196.5, 155.5,
        LT, -180.5, 163.5,
        LT, -191.5, 170.5,
        F, S, BP,
        MT, 181.5, 126.5,
        LT, 177.5, 141.5,
        LT, 195.5, 141.5,
        F, S, BP,
        MT, 196.5, 155.5,
        LT, 180.5, 163.5,
        LT, 191.5, 170.5,
        F, S
    ];

    m_oOData = [
        SS, 0, FS, 0, LW, 1, BP,
        MT, -113, 0,
        BCT, -118, -4, -117, -10, -111, -16,
        BCT, -117, -31, -116, -44, -98, -60,
        BCT, -97, -72, -94, -80, -80, -83,
        BCT, -78, -95, -73, -102, -50, -103,
        BCT, -51, -111, -42, -115, -31, -110,
        BCT, -29, -117, -22, -120, -13, -112,
        BCT, 5, -124, 22, -118, 36, -107,
        BCT, 57, -108, 64, -102, 72, -86,
        BCT, 79, -85, 84, -84, 82, -75,
        BCT, 98, -70, 107, -62, 107, -31,
        BCT, 112, -29, 119, -12, 111, 0,
        BCT, 119, 15, 110, 29, 105, 34,
        BCT, 110, 51, 94, 83, 70, 87,
        BCT, 69, 94, 63, 110, 44, 102,
        BCT, 40, 109, 35, 119, 18, 109,
        BCT, -8, 126, -38, 120, -53, 97,
        BCT, -62, 100, -72, 101, -73, 86,
        BCT, -99, 81, -107, 62, -107, 40,
        BCT, -116, 34, -120, 17, -113, 0,
        F, S,
        SS, 1, FS, 1, BP,
        MT, -105, 0,
        BCT, -109, -7, -107, -7, -104, -14,
        BCT, -105, -31, -98, -46, -90, -58,
        BCT, -87, -69, -78, -75, -74, -77,
        BCT, -68, -87, -54, -93, -46, -94,
        BCT, -41, -103, -35, -102, -28, -101,
        BCT, -22, -106, -19, -107, -12, -104,
        BCT, 6, -112, 28, -106, 34, -99,
        BCT, 50, -100, 62, -88, 67, -81,
        BCT, 73, -79, 75, -77, 76, -72,
        BCT, 91, -65, 101, -45, 100, -29,
        BCT, 109, -20, 107, -10, 104, 0,
        BCT, 106, 10, 104, 23, 99, 32,
        BCT, 97, 55, 79, 71, 65, 81,
        BCT, 61, 93, 49, 94, 41, 95,
        BCT, 36, 102, 25, 103, 17, 101,
        BCT, -10, 114, -41, 99, -49, 89,
        BCT, -57, 90, -62, 87, -65, 78,
        BCT, -87, 71, -97, 51, -99, 38,
        BCT, -107, 31, -106, 10, -105, 0,
        F, S,
        SS, 0, FS, 0, BP,
        MT, -85, 0,
        BCT, -82, -5, -83, -10, -85, -16,
        BCT, -78, -25, -74, -40, -72, -48,
        BCT, -67, -50, -63, -58, -62, -61,
        BCT, -52, -65, -42, -73, -40, -77,
        BCT, -33, -77, -25, -80, -24, -84,
        BCT, -19, -82, -13, -83, -10, -86,
        BCT, -1, -81, 24, -80, 28, -82,
        BCT, 31, -75, 50, -64, 59, -61,
        BCT, 63, -49, 71, -36, 81, -28,
        BCT, 77, -18, 81, -5, 83, 0,
        BCT, 79, 7, 79, 18, 80, 24,
        BCT, 68, 35, 56, 58, 54, 65,
        BCT, 45, 63, 38, 70, 36, 74,
        BCT, 29, 73, 24, 75, 20, 80,
        BCT, 2, 77, -25, 75, -38, 76,
        BCT, -39, 67, -46, 65, -53, 66,
        BCT, -55, 54, -77, 27, -81, 27,
        BCT, -81, 17, -81, 9, -85, 0,
        F, S,
        SS, 2, FS, 2, BP,
        MT, -76, 0,
        BCT, -73, -5, -70, -7, -76, -15,
        BCT, -63, -22, -63, -36, -64, -45,
        BCT, -57, -46, -59, -49, -59, -53,
        BCT, -46, -56, -37, -59, -37, -71,
        BCT, -28, -68, -16, -69, -10, -78,
        BCT, -3, -71, 14, -71, 25, -75,
        BCT, 25, -61, 43, -56, 53, -57,
        BCT, 50, -45, 59, -31, 72, -27,
        BCT, 62, -14, 69, -5, 75, 0,
        BCT, 67, 4, 65, 17, 72, 22,
        BCT, 59, 25, 48, 44, 50, 56,
        BCT, 33, 53, 22, 62, 19, 70,
        BCT, 4, 62, -20, 58, -33, 67,
        BCT, -34, 59, -40, 56, -47, 59,
        BCT, -46, 46, -54, 28, -73, 22,
        BCT, -67, 14, -69, 6, -76, 0,
        F, S
    ];

    m_oXData = [
        SS, 0, FS, 0, LW, 1, BP,
        MT, -33, 0,
        BCT, -52, -1, -61, -9, -58, -32,
        BCT, -67, -32, -78, -31, -76, -50,
        BCT, -88, -50, -92, -54, -85, -71,
        BCT, -89, -81, -86, -94, -66, -87,
        BCT, -54, -94, -30, -75, -27, -56,
        BCT, -17, -61, -5, -56, 0, -41,
        BCT, 3, -48, 5, -52, 17, -44,
        BCT, 14, -53, 23, -71, 43, -69,
        BCT, 43, -73, 41, -93, 68, -86,
        BCT, 78, -91, 88, -80, 80, -60,
        BCT, 82, -42, 67, -33, 53, -33,
        BCT, 53, -23, 51, -8, 36, -2,
        BCT, 48, 1, 48, 12, 48, 22,
        BCT, 60, 22, 66, 29, 65, 38,
        BCT, 74, 37, 84, 40, 80, 51,
        BCT, 89, 54, 96, 63, 83, 74,
        BCT, 85, 82, 77, 96, 62, 82,
        BCT, 56, 84, 31, 83, 34, 56,
        BCT, 21, 56, 5, 54, 2, 32,
        BCT, 2, 40, -6, 42, -16, 38,
        BCT, -16, 42, -19, 61, -36, 59,
        BCT, -34, 65, -39, 82, -58, 77,
        BCT, -63, 88, -76, 91, -82, 79,
        BCT, -87, 77, -95, 77, -83, 59,
        BCT, -83, 36, -67, 24, -43, 18,
        BCT, -44, 9, -49, 4, -33, 0,
        F, S,
        SS, 1, FS, 1, BP,
        MT, -18, 2,
        BCT, -24, -3, -28, -9, -28, -14,
        BCT, -39, -18, -48, -30, -50, -38,
        BCT, -58, -42, -69, -49, -69, -55,
        BCT, -75, -62, -80, -64, -78, -70,
        BCT, -78, -79, -76, -82, -67, -80,
        BCT, -54, -78, -45, -68, -44, -58,
        BCT, -36, -58, -25, -44, -25, -39,
        BCT, -13, -39, -7, -27, -5, -18,
        BCT, -2, -26, 3, -23, 6, -21,
        BCT, 9, -31, 15, -35, 21, -38,
        BCT, 25, -49, 36, -59, 48, -63,
        BCT, 51, -74, 58, -79, 66, -79,
        BCT, 77, -76, 76, -68, 74, -62,
        BCT, 75, -51, 62, -45, 48, -36,
        BCT, 47, -27, 46, -27, 39, -26,
        BCT, 37, -18, 30, -11, 20, -8,
        BCT, 25, -6, 25, 5, 24, 9,
        BCT, 37, 10, 42, 21, 41, 28,
        BCT, 51, 28, 59, 38, 59, 44,
        BCT, 69, 44, 75, 51, 75, 58,
        BCT, 82, 63, 82, 70, 78, 71,
        BCT, 76, 82, 69, 80, 63, 78,
        BCT, 48, 73, 38, 60, 38, 52,
        BCT, 28, 47, 8, 31, 6, 19,
        BCT, 2, 22, -3, 23, -6, 19,
        BCT, -7, 28, -15, 33, -21, 35,
        BCT, -22, 45, -35, 54, -43, 55,
        BCT, -42, 63, -52, 70, -60, 72,
        BCT, -67, 80, -73, 76, -76, 73,
        BCT, -84, 70, -79, 65, -77, 60,
        BCT, -71, 42, -55, 33, -47, 31,
        BCT, -45, 24, -39, 18, -31, 17,
        BCT, -29, 9, -25, 5, -18, 2,
        F, S
    ];

    m_oLiliPadData = [
        SS, 0, FS, 0, LW, 1, BP,
        MT, 0, 100,
        BCT, -66, 100, -100, 41, -100, -8,
        BCT, -100, -51, -65, -100, -32, -100,
        BCT, 0, -100, 0, -100, 0, -84,
        BCT, 0, -100, 0, -100, 32, -100,
        BCT, 65, -100, 100, -51, 100, -8,
        BCT, 100, 41, 66, 100, 0, 100,
        F, S,
        SS, 1, FS, 1, BP,
        MT, 0, 94,
        BCT, -71, 94, -94, 23, -94, -8,
        BCT, -94, -54, -56, -94, -33, -94,
        BCT, 0, -94, 0, -94, 0, -70,
        BCT, 0, -94, 0, -94, 33, -94,
        BCT, 54, -94, 94, -56, 94, -8,
        BCT, 94, 23, 71, 94, 0, 94,
        F, S,
        SS, 2, FS, 2, BP,
        MT, 50, -80,
        BCT, 52, -74, 38, -55, 34, -46,
        BCT, 30, -38, 17, -10, 10, -10,
        BCT, 7, -19, 23, -40, 27, -48,
        BCT, 33, -60, 44, -80, 50, -80,
        F, S,
        BP, MT, 77, 10,
        BCT, 70, 14, 57, 10, 43, 10,
        BCT, 30, 8, 19, 5, 12, 0,
        BCT, 20, -3, 30, 0, 45, 2,
        BCT, 58, 4, 70, 4, 77, 10,
        F, S,
        BP, MT, 30, 76,
        BCT, 21, 70, 19, 55, 16, 44,
        BCT, 13, 33, 6, 17, 10, 10,
        BCT, 17, 15, 19, 26, 23, 41,
        BCT, 27, 52, 33, 68, 30, 76,
        F, S,
        BP, MT, -30, 76,
        BCT, -33, 65, -27, 50, -24, 40,
        BCT, -21, 29, -18, 16, -10, 10,
        BCT, -8, 16, -13, 33, -16, 43,
        BCT, -19, 54, -22, 71, -30, 76,
        F, S,
        BP, MT, -80, 10,
        BCT, -75, 4, -62, 4, -47, 2,
        BCT, -33, 0, -20, -5, -13, 0,
        BCT, -17, 5, -26, 7, -43, 10,
        BCT, -62, 12, -73, 14, -80, 10,
        F, S,
        BP, MT, -50, -80,
        BCT, -44, -80, -36, -62, -27, -47,
        BCT, -20, -35, -8, -17, -10, -10,
        BCT, -16, -10, -25, -27, -34, -43,
        BCT, -43, -59, -53, -74, -50, -80,
        F, S
    ];

    // Private Vars
    var m_fnBtnClickCallback = fnBtnClickCallback;
    var m_fnGameBoardClickCallback = fnGameBoardClickCallback;
    var m_nViewState;

    var m_oToadSkinColors = [["#3f290b", "#754300", "#9b6701"],
                             ["#9a3904", "#cf4d06", "#f16417"],
                             ["#929200", "#e0e000", "#ffff00"],
                             ["#4c943e", "#75e058", "#89fb72"],
                             ["#028046", "#02b563", "#03db78"],
                             ["#18408a", "#2158bd", "#266ae3"],
                             ["#683093", "#9d4bdc", "#b055f6"]];
    var m_oXOColors = [["#303030", "black"],
                       ["#ff0000", "#c61300"],
                       ["#24ab09", "#1e7b0c"],
                       ["#2c1df6", "#1e14a7"],
                       ["#5a25d2", "#3e1798"],
                       ["#c49d15", "#ae8b12"],
                       ["#cccccc", "#ffffff"]];
    ;
    var m_oPlayerColors = [["#3f290b", "#754300", "#9b6701", "#303030", "black"],
                           ["#303030", "black", "#9b6701"],
                           ["#3f290b", "#754300", "#9b6701", "#303030", "black"],
                           ["#303030", "black", "#9b6701"]];
    var m_oLiliPadColors = ["#9ebc25", "#679135", "#537c23"];
    var m_oPlayerMarks = new Array(2); //Each element is either 'X' or 'O'.

    //Private functions

    //***************************************************************************
    // Description: Draws text along arc.
    // Params: oCtx      - 2d context for canvas.
    //         x, y      - Offset from canvas upper left corner in pixels, where 
    //                     center of rotation is.
    //         fRadius   - Distance from x, y.
    //         fStartAng - Starting angle in degrees.  0 is at 12 o'clock.
    //         fSpacing  - Angle (degrees) between chars.  This is the average,
    //                     actual spacing is based on char width & font.
    //         s         - String to display.
    // returns: none.
    //***************************************************************************
    function drawTextAlongArc(oCtx, x, y, fRadius, fStartAng, fSpacing, s) {
        var fRadAng = fStartAng * Math.PI / 180.0;
        var fRadSpacing = fSpacing * Math.PI / 180.0;
        var oTextDimN = oCtx.measureText("N");
        var x1, y1, i, c, fPercent;

        for (i = 0; i < s.length; i++) {
            c = s[i];
            x1 = Math.round(x + Math.sin(fRadAng) * fRadius);
            y1 = Math.round(y - Math.cos(fRadAng) * fRadius);

            fPercent = oCtx.measureText(c).width / oTextDimN.width;

            oCtx.save();
            oCtx.translate(x1, y1);
            oCtx.rotate(fRadAng + ((fRadSpacing * fPercent) / 2.0));
            oCtx.fillText(c, 0, 0);
            oCtx.strokeText(c, 0, 0);
            oCtx.restore();

            fRadAng += (fRadSpacing * fPercent);
        }
    }

    //***************************************************************************
    // Description: Draws in canvas using context functions including arc(),
    //              lineTo(), bezierCurveTo(), ect.  Uses array of data which
    //              contains integer idetifying what function to call followed
    //              by its parameters.
    // Params:      x, y  - Offset from canvas upper left corner in pixels, where
    //                      item drawn is centered.
    //              oCtx  - 2d context for canvas.
    //              oData - Array of data containing context commands to call and
    //                      their parameters (if any).  Any color parameters are
    //                      0 based indices into oColor array.
    //              oColors - Array of color values (strings like "#303030" or 
    //                      "black").
    // Returns:     None.
    //***************************************************************************
    function drawFromData(x, y, oCtx, oData, oColors) {
        var i = 0;

        while (i < oData.length) {
            switch (oData[i]) {
                case A:
                    oCtx.arc(x + oData[++i], y + oData[++i], oData[++i], oData[++i], oData[++i]);
                    break;
                case BCT:
                    oCtx.bezierCurveTo(x + oData[++i], y + oData[++i], x + oData[++i], y + oData[++i], x + oData[++i], y + oData[++i]);
                    break;
                case BP:
                    oCtx.beginPath();
                    break;
                case F:
                    oCtx.fill();
                    break;
                case FS:
                    oCtx.fillStyle = oColors[oData[++i]];
                    break;
                case LC:
                    oCtx.lineCap = oData[++i];
                    break;
                case LT:
                    oCtx.lineTo(x + oData[++i], y + oData[++i]);
                    break;
                case LW:
                    oCtx.lineWidth = oData[++i];
                    break;
                case MT:
                    oCtx.moveTo(x + oData[++i], y + oData[++i]);
                    break;
                case S:
                    oCtx.stroke();
                    break;
                case SS:
                    oCtx.strokeStyle = oColors[oData[++i]];
                    break;
            }
            i++;
        }
    }

    //***************************************************************************
    // Description: Draws the playing board
    // Params:      oCtx  - 2d context for canvas.
    // Returns:     None.
    //***************************************************************************
    function drawBoard(oCtx) {
        drawFromData(100, 220, oCtx, m_oLiliPadData, m_oLiliPadColors);
        drawFromData(320, 220, oCtx, m_oLiliPadData, m_oLiliPadColors);
        drawFromData(540, 220, oCtx, m_oLiliPadData, m_oLiliPadColors);

        drawFromData(100, 430, oCtx, m_oLiliPadData, m_oLiliPadColors);
        drawFromData(320, 430, oCtx, m_oLiliPadData, m_oLiliPadColors);
        drawFromData(540, 430, oCtx, m_oLiliPadData, m_oLiliPadColors);

        drawFromData(100, 640, oCtx, m_oLiliPadData, m_oLiliPadColors);
        drawFromData(320, 640, oCtx, m_oLiliPadData, m_oLiliPadColors);
        drawFromData(540, 640, oCtx, m_oLiliPadData, m_oLiliPadColors);
    }

    //***************************************************************************
    // Description: Draws view in canvas and shows/hides HTML elements positioned
    //              over canvas.  Contents match current view state.
    // Params:      None.
    // Returns:     None.
    //***************************************************************************
    function drawView() {
        var iPlayer;
        var oCtx = $("#mainCanvas")[0].getContext("2d");

        oCtx.lineWidth = 3;
        oCtx.font = "800 70px Arial";
        oCtx.strokeStyle = "#9ebc25";
        oCtx.fillStyle = "#679135";
        drawTextAlongArc(oCtx, 320, 648, 600.0, 333.75, 6.0, "Tic-Tac-Toad");

        switch (m_nViewState) {
            case GS_SELECT_PLAY_MODE:
                $("#lblSelectMode, #btnOnePlayer, #btnTwoPlayer").show();
                $("#lblUseXorO, #btnPlayX, #btnPlayO, #lblXPlayerCustomize, #lblOPlayerCustomize, #divSelectColors, #lblStatusMsg, #btnNextGame").hide();
                break;
            case GS_P1_SELECT_X_OR_O:
                $("#lblUseXorO, #btnPlayX, #btnPlayO").show();
                $("#lblSelectMode, #btnOnePlayer, #btnTwoPlayer, #lblXPlayerCustomize, #lblOPlayerCustomize, #divSelectColors, #lblStatusMsg, #btnNextGame").hide();
                break;
            case GS_X_CONFIG_TOAD:
                $("#lblXPlayerCustomize, #divSelectColors").show();
                $("#lblSelectMode, #btnOnePlayer, #btnTwoPlayer, #lblUseXorO, #btnPlayX, #btnPlayO, #lblOPlayerCustomize, #lblStatusMsg, #btnNextGame").hide();

                iPlayer = (m_oPlayerMarks[0] === 'X') ? 0 : 2;

                oCtx.clearRect(0, 120, 640, 800);
                drawFromData(320, 640, oCtx, m_oLiliPadData, m_oLiliPadColors);
                oCtx.save();
                oCtx.scale(0.4, 0.4);
                drawFromData(798, 1610, oCtx, m_oToadData, m_oPlayerColors[iPlayer]);
                drawFromData(798, 1610, oCtx, m_oXData, m_oPlayerColors[iPlayer + 1]);
                oCtx.restore();
                break;
            case GS_O_CONFIG_TOAD:
                $("#lblOPlayerCustomize, #divSelectColors").show();
                $("#lblSelectMode, #btnOnePlayer, #btnTwoPlayer, #lblUseXorO, #btnPlayX, #btnPlayO, #lblXPlayerCustomize, #lblStatusMsg, #btnNextGame").hide();

                iPlayer = (m_oPlayerMarks[0] === 'O') ? 0 : 2;

                oCtx.clearRect(0, 120, 640, 800);
                drawFromData(320, 640, oCtx, m_oLiliPadData, m_oLiliPadColors);
                oCtx.save();
                oCtx.scale(0.4, 0.4);
                drawFromData(798, 1610, oCtx, m_oToadData, m_oPlayerColors[iPlayer]);
                drawFromData(798, 1610, oCtx, m_oOData, m_oPlayerColors[iPlayer + 1]);
                oCtx.restore();
                break;
            case GS_PLAY_GAME:
                $("#lblSelectMode, #btnOnePlayer, #btnTwoPlayer, #lblUseXorO, #btnPlayX, #btnPlayO, #lblXPlayerCustomize, #lblOPlayerCustomize, #divSelectColors, #btnNextGame").hide();
                $("#lblStatusMsg").show();
                oCtx.clearRect(0, 120, 640, 800);
                drawBoard(oCtx);
                break;
            case GS_GAME_OVER:
                $("#lblSelectMode, #btnOnePlayer, #btnTwoPlayer, #lblUseXorO, #btnPlayX, #btnPlayO, #lblXPlayerCustomize, #lblOPlayerCustomize, #divSelectColors").hide();
                $("#lblStatusMsg, #btnNextGame").show();
                break;
        }
    }

    //Public Methods

    //***************************************************************************
    // Description: Sets up jquery click handlers for all buttons.
    // Params:      None.
    // Returns:     None.
    //***************************************************************************
    this.init = function () {
        m_nViewState = GS_SELECT_PLAY_MODE;

        $("#btnOnePlayer, #btnTwoPlayer, #btnPlayX, #btnPlayO, #btnDone, #btnNextGame").click(function (event) {
            var sClickID = $(event.target).attr("clickID");
            event.preventDefault();
            m_fnBtnClickCallback(sClickID);
        });

        $(".btnColor").click(function (event) {
            var iColor, iPlayer;
            var sClickID = $(event.target).attr("clickID");
            event.preventDefault();

            iColor = parseInt(sClickID[9]) - 1;

            if (m_nViewState == GS_X_CONFIG_TOAD) {
                iPlayer = (m_oPlayerMarks[0] === 'X') ? 0 : 2;
            } else {
                iPlayer = (m_oPlayerMarks[0] === 'O') ? 0 : 2;
            }

            if (sClickID.indexOf("ToadColor") != -1) {
                m_oPlayerColors[iPlayer][0] = m_oToadSkinColors[iColor][0];
                m_oPlayerColors[iPlayer][1] = m_oToadSkinColors[iColor][1];
                m_oPlayerColors[iPlayer][2] = m_oToadSkinColors[iColor][2];
                m_oPlayerColors[iPlayer + 1][2] = m_oToadSkinColors[iColor][2];
            } else {
                m_oPlayerColors[iPlayer + 1][0] = m_oXOColors[iColor][0];
                m_oPlayerColors[iPlayer + 1][1] = m_oXOColors[iColor][1];
            }

            var oCtx = $("#mainCanvas")[0].getContext("2d");
            oCtx.save();
            oCtx.scale(0.4, 0.4);
            drawFromData(798, 1610, oCtx, m_oToadData, m_oPlayerColors[iPlayer]);
            drawFromData(798, 1610, oCtx, (m_nViewState == GS_X_CONFIG_TOAD) ? m_oXData : m_oOData, m_oPlayerColors[iPlayer + 1]);
            oCtx.restore();
        });

        $("#mainCanvas").click(function (event) {
            if (m_nViewState == GS_PLAY_GAME) {
                var oRect = $(this)[0].getBoundingClientRect();
                var x = event.pageX - oRect.left;
                var y = event.pageY - oRect.top;
                var iCol = (x >= 0 && x <= 200) ? 0 : ((x >= 220 && x <= 420) ? 1 : (x >= 440 && x <= 640) ? 2 : -1);
                var iRow = (y >= 120 && y <= 320) ? 0 : ((y >= 330 && y <= 530) ? 1 : (y >= 540 && y <= 740) ? 2 : -1);

                //console.log("Row:" + iRow + " Col:" + iCol);
                if (iRow != -1 && iCol != -1) {
                    m_fnGameBoardClickCallback(iRow, iCol);
                }
            }
        });
    };

    //***************************************************************************
    // Description: Sets view state and draws the view in canvas (and hides/shows
    //              controls over canvas).
    // Params:      nViewState - New view state (see GS_ constants).
    // Returns:     None.
    //***************************************************************************
    this.setViewState = function (nViewState) {
        m_nViewState = nViewState;
        drawView();
    }

    //***************************************************************************
    // Description: Sets mark (X or O) for player 1.  Player 1 is the player that
    //              goes first in the first game.  By default, also sets player 
    //              mark for second player.
    // Params:      sMark - "X" or "O".
    // Returns:     None.
    //***************************************************************************
    this.setPlayer1Mark = function (sMark) {
        if (sMark === 'X') {
            m_oPlayerMarks[0] = 'X';
            m_oPlayerMarks[1] = 'O';
        } else {
            m_oPlayerMarks[0] = 'O';
            m_oPlayerMarks[1] = 'X';
        }
    }

    //***************************************************************************
    // Description: Draws all toads on the board.
    // Params:      oBoard - 3x3 array of integers, each with the following
    //                       values:
    //                       0  - first player
    //                       1  - second player
    //                       -1 - empty
    // Returns:     None.
    //***************************************************************************
    this.drawToadsOnBoard = function (oBoard) {
        var iRow, iCol, x, y, iPlyr;
        var oCtx = $("#mainCanvas")[0].getContext("2d");

        oCtx.save();
        oCtx.scale(0.4, 0.4);

        for (iRow = 0, y = 550; iRow < 3; iRow++, y += 523) {
            for (iCol = 0, x = 250; iCol < 3; iCol++, x += 550) {
                if ((iPlyr = oBoard[iRow][iCol]) != -1) {
                    drawFromData(x, y, oCtx, m_oToadData, m_oPlayerColors[iPlyr * 2]);
                    drawFromData(x, y, oCtx, (m_oPlayerMarks[iPlyr] == 'X') ? m_oXData : m_oOData, m_oPlayerColors[(iPlyr * 2) + 1]);
                }
            }
        }

        oCtx.restore();
    }

    //***************************************************************************
    // Description: Sets status message to display above game board.
    // Params:      sMsg - String message to display.
    // Returns:     None.
    //***************************************************************************
    this.setGameStatusMsg = function (sMsg) {
        $("#lblStatusMsg").text(sMsg);
    }
};
