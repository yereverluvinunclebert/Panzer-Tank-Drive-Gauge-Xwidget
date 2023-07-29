/*
	Tank CPU gauge Widget

	Created by Dean Beedell

	Face adapted from KJC66's Widget
	Re-coded by Dean Beedell
	Visuals added to and enhanced by Dean Beedell
	Code sorted by Harry Whitfield
        Stopwatch code by Harry Whitfield 
        
	email: dean.beedell@lightquick.co.uk
	http://lightquick.co.uk
*/

// add sounds
// main screen - tablets /portrait/landscape?


var windowPos = 0;

var buzzer = "buzzer.wav";
var counter = "counter.wav";
var lock = "lock.wav";
var till = "till01.wav";
var ting = "ting.wav";
var mistake = "mistake.wav";
var thhhh = "thhhh.wav";
var winding = "winding.wav";

var size = 1,
         maxLength = 100,
         minLength = 10,
         ticks = 18
         Scale = 100;

var stopWatchState = 0; 
var animationBusy = false;      
var driveCounter = 1;
var storeLockPosition = 0;

// wscript required to enable F5
var wsc=new ActiveXObject("WScript.Shell");

//===========================================
// this function runs on startup
//===========================================
function widgetOnLoad() {
    getPrefs();                       // set the preferences - required by Xwidget as it has no native prefs
    createLicence();
    mainScreen();                     // check the widget is on-screen
    resize();                         // resize if required    
    setActionSwitch();
    gaugeFace.visible = true;
    settooltip();                     // build the tooltips
    checkLockWidget();
    checkSpace();
}
//=====================
//End function
//=====================


//======================================================================================
// Function to move the main_window onto the main screen
//======================================================================================
function mainScreen() {
    // if the widget is off screen then move into the viewable window
    print(" preferenceshoffsetprefvalue.text "+ (preferenceshoffsetprefvalue.text));

    //var arse =  parseInt(preferenceshoffsetprefvalue.text);
    if ( preferenceshoffsetprefvalue.text !="" ) {
              widget.left = parseInt(preferenceshoffsetprefvalue.text);
    }
    if (preferencesvoffsetprefvalue.text !="" ) {
              widget.top = parseInt(preferencesvoffsetprefvalue.text);
    }
    if (widget.left < 0) {
        widget.left = 10;
    }
    if (widget.top < 0) {
        widget.top = 10;
    }
}
//=====================
//End function
//=====================

function setPosition() {
    // print(" preferenceshoffsetprefvalue.text " + preferenceshoffsetprefvalue.text);
    if (preferenceshoffsetprefvalue.text != "") {
       widget.left = parseInt(preferenceshoffsetprefvalue.text);
       widget.top = parseInt(preferencesvoffsetprefvalue.text);
    } else {
       widget.left = 0;
       widget.top = 0;
    }
}
// end function


//======================================================================================
// Function to perform commands
//======================================================================================
function performCommand() {

    print("preferencesimageCmdPrefvalue.text "+preferencesimageCmdPrefvalue.text);
    if ( preferencesimageCmdPrefvalue.text == "" )
    {
        if (confirm2("This widget has not been assigned a double-click function yet - You need to open the preferences and set a function for this widget. Do you wish to proceed?"))
        {
             makePrefsVisible();
        }
    } else {
        if (preferencessoundprefvalue.text != "disabled") {
                PlaySound(ting);
        }
        run(preferencesimageCmdPrefvalue.text);
    }
}
//=====================
//End function
//=====================

function makePrefsVisible() {
         storeLockPosition = widget.lockposition;
         gaugeFace.visible = false;
         sleep (100); // stops the widget prefs appearing in a different position
         widget.lockposition = 0;
         widget.left = workareawidth /2  - widget.width;
         widget.top = workareaheight - widget.height;
         showWidgetPreferences.visible = true;


}

function makeGaugeVisible() {
         showWidgetPreferences.visible = false;
         sleep (100); // stops the widget prefs appearing in a different position
         widget.lockposition = storeLockPosition;

         // widget.left = workareawidth /2  - widget.width;
         // widget.top = workareaheight /2  - widget.height;

         setPosition();
         gaugeFace.visible = true;

}



//=========================================================================
// this function closes the preferences
//=========================================================================
function cancelbutton()
{
         makeGaugeVisible();
}
//=====================
//End function
//=====================


//
//=========================================================================
// this function shows the preferences when the first menu option is chosen
//=========================================================================
function menuitem8OnClick(Sender)
{

         showWidgetPreferences.top =  background.top + 50;
         makePrefsVisible();
}
//=====================
//End function
//=====================

function prefsOnMouseUp(Sender,Button,Shift,X,Y)
{
     prefs.src="prefs01.png";
     if (preferencessoundprefvalue.text != "disabled" ) {playsound(winding);};
     makePrefsVisible();
     savebutton.SetFocus();
}



//=========================================================================
// this function saves the preferences to an ini file for later use
//=========================================================================
function savePrefs()
{
         print ("Saving Prefs ");
         Setinivalue(widgetpath+"prefs.ini","prefs","preferenceshoffsetprefvalue",preferenceshoffsetprefvalue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencesvoffsetprefvalue",preferencesvoffsetprefvalue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferenceswidgetTooltipvalue",preferenceswidgetTooltipvalue.text);
         //print("preferencesimageCmdPrefvalue.text "+preferencesimageCmdPrefvalue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencesimageCmdPrefvalue",preferencesimageCmdPrefvalue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencessoundprefvalue",preferencessoundprefvalue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencesGaugeSizevalue",preferencesGaugeSizevalue.percent);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencesLicenceHideValue",preferencesLicenceHideValue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencesMouseWheelPrefValue",preferencesMouseWheelPrefValue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencesHintPrefValue",preferencesHintPrefValue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferenceswidgetLockLandscapeModePrefvalue",preferenceswidgetLockLandscapeModePrefvalue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencesActionSwitchPrefValue",preferencesActionSwitchPrefValue.text);

         print("preferencesHintPrefValue.text "+preferencesHintPrefValue.text);

}
//=====================
//End function
//=====================

// END OF CHANGES             

//=========================================================================
// this function sets the preference values to saved values
//=========================================================================
function getPrefs(){
    preferenceshoffsetprefvalue.text =     Getinivalue(widgetpath+"prefs.ini","prefs","preferenceshoffsetprefvalue","350");
    preferencesvoffsetprefvalue.text =     Getinivalue(widgetpath+"prefs.ini","prefs","preferencesvoffsetprefvalue","350");
    preferenceswidgetTooltipvalue.text =   Getinivalue(widgetpath+"prefs.ini","prefs","preferenceswidgetTooltipvalue","Double-Click on me to set the widget command");  
    preferencesimageCmdPrefvalue.text =    Getinivalue(widgetpath+"prefs.ini","prefs","preferencesimageCmdPrefvalue","");
    print("preferencesGaugeSizevalue.percent "+preferencesGaugeSizevalue.percent);
    preferencessoundprefvalue.text =       Getinivalue(widgetpath+"prefs.ini","prefs","preferencessoundprefvalue","enabled");
    preferencesGaugeSizevalue.percent =    Getinivalue(widgetpath+"prefs.ini","prefs","preferencesGaugeSizevalue","100");
    preferencesLicenceHideValue.text =     Getinivalue(widgetpath+"prefs.ini","prefs","preferencesLicenceHideValue",0);
    preferencesMouseWheelPrefValue.text =  Getinivalue(widgetpath+"prefs.ini","prefs","preferencesMouseWheelPrefValue","up");
    preferencesHintPrefValue.text =        Getinivalue(widgetpath+"prefs.ini","prefs","preferencesHintPrefValue","enabled");
    preferenceswidgetLockLandscapeModePrefvalue   .text =        Getinivalue(widgetpath+"prefs.ini","prefs","preferenceswidgetLockLandscapeModePrefvalue","enabled");
    preferencesActionSwitchPrefValue.text  =     Getinivalue(widgetpath+"prefs.ini","prefs","preferencesActionSwitchPrefValue","continuous");
    
    print("preferencesHintPrefValue.text "+preferencesHintPrefValue.text);
        
    if (preferencessoundprefvalue.text != "disabled") {
        soundbutton.src="bellpushed.png";         // this in place of a checkbutton which I could not get to work correctly
    } else {
        soundbutton.src="bell.png";
    }
}
//=====================
//End function
//=====================



//=========================================================================
// this function saves the preferences to an ini file for later use
//=========================================================================
function savePrefs()
{
         print ("Saving Prefs ");
         Setinivalue(widgetpath+"prefs.ini","prefs","preferenceshoffsetprefvalue",preferenceshoffsetprefvalue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencesvoffsetprefvalue",preferencesvoffsetprefvalue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferenceswidgetTooltipvalue",preferenceswidgetTooltipvalue.text);
         //print("preferencesimageCmdPrefvalue.text "+preferencesimageCmdPrefvalue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencesimageCmdPrefvalue",preferencesimageCmdPrefvalue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencessoundprefvalue",preferencessoundprefvalue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencesGaugeSizevalue",preferencesGaugeSizevalue.percent);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencesLicenceHideValue",preferencesLicenceHideValue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencesMouseWheelPrefValue",preferencesMouseWheelPrefValue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencesHintPrefValue",preferencesHintPrefValue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferenceswidgetLockLandscapeModePrefvalue",preferenceswidgetLockLandscapeModePrefvalue.text);
         Setinivalue(widgetpath+"prefs.ini","prefs","preferencesActionSwitchPrefValue",preferencesActionSwitchPrefValue.text);
         
         sleep (100); // stops the widget prefs appearing in a different position
         print("preferencesHintPrefValue.text "+preferencesHintPrefValue.text);

}
//=====================
//End function
//=====================



//=========================================================================
// this function opens the about us layer
//=========================================================================
function menuitem2OnClick() {
         //print("here!");

         aboutUsLayer.visible = true;
         aboutUsLayer.FadeTo(255,1); // this does not work but is need to counter the fade out.
         

}
//=====================
//End function
//=====================


//=========================================================================
// this function fades the about us image
//=========================================================================
function aboutUsOnClick() {
         aboutUsLayer.FadeTo(0,1);
         setTimeout("fadeDone",1000);

}
//=====================
//End function
//=====================

//=========================================================================
// this function closes the about us image
//=========================================================================
function fadeDone () {
         aboutUsLayer.visible = false;
}
//=====================
//End function
//=====================

//===========================================
// this function opens the online help file
//===========================================
function menuitem4OnClick(Sender)
{
          if (confirm2("This button opens a browser window and connects to the help page for this widget. Will you proceed?"))
          {
              OpenURL("http://lightquick.co.uk/instructions-for-the-drive-storage-gauge-xwidgets.html");
          }
}
//=====================
//End function
//=====================


//=========================================================================
// this function opens a browser at the paypal page
//=========================================================================
function menuitem5OnClick(Sender)
{
          if (confirm2("Help support the creation of more widgets like this, send us a coffee! This button opens a browser window and connects to the Ko-Fi donate page for this widget). Will you be kind and proceed?"))
          {
                openURL("https://www.ko-fi.com/yereverluvinunclebert");
		if (preferencessoundprefvalue.text != "disabled") {
			PlaySound(winding);
		}          
           }
}
//=====================
//End function
//=====================


//=========================================================================
// this function opens a browser at the Amazon page
//=========================================================================
function menuitem6OnClick(Sender)
{
          if (confirm2("Help support the creation of more widgets like this. Buy me a small item on my Amazon wishlist! This button opens a browser window and connects to my Amazon wish list page). Will you be kind and proceed?"))
          {
               openURL("http://www.amazon.co.uk/gp/registry/registry.html?ie=UTF8&id=A3OBFB6ZN4F7&type=wishlist");
          }
}
//=====================
//End function
//=====================


//=========================================================================
// this function opens a browser at the Rocketdock page
//=========================================================================
function menuitem7OnClick(Sender)
{
          if (confirm2("Log in and vote for the widget on Rocketdock. This button opens a browser window and connects to the Rocketdock page where you can give the widget a 5 star rating... Will you be kind and proceed?"))
          {
		openURL("http://rocketdock.com/addon/icons/47311");
		if (preferencessoundprefvalue.text != "disabled") {
			PlaySound(winding);
		}
          }
}
//=====================
//End function
//=====================



//===========================================
// this function opens the 'other' widgets URL
//===========================================
function menuitem9OnClick(Sender)
{
          if (confirm2("This button opens a browser window and connects to the Steampunk widgets page on my site. Do you wish to proceed?"))
          {
                 openURL("http://lightquick.co.uk/steampunk-widgets.html?Itemid=264");
          }
}
//=====================
//End function
//=====================


//===========================================
// this function opens the browser at the contact URL
//===========================================
function menuitem10OnClick(Sender)
{
          if (confirm2("Visiting the support page - this button opens a browser window and connects to our contact us page where you can send us a support query or just have a chat). Proceed?"))
          {
              openURL("http://lightquick.co.uk/contact.html?Itemid=3");
          }
}
//=====================
//End function
//=====================

//===========================================
// this function opens the licence from the menu
//===========================================
function menuitem11OnClick(Sender)
{
    licence.Visible = true;
}
//=====================
//End function
//=====================


//===========================================
// this function declines the licence terms
//===========================================
function DeclineOnClick (Sender,Button,Shift,X,Y)
{
        preferencesLicenceHideValue.text = "0";
        savePrefs();
        widget.close
}
//=====================
//End function
//=====================


//===========================================
// this function accepts the licence terms
//===========================================
function AcceptOnClick(Sender,Button,Shift,X,Y)
{
  if (preferencessoundprefvalue.text != "disabled" ) {
      PlaySound(buzzer);    //this won't sound when the mute is set
  }
      preferencesLicenceHideValue.text = "1";
      licence.visible = false;
      savePrefs();
}
//=====================
//End function
//=====================

//===========================================
// this function opens the licence creen
//===========================================
function createLicence() {
	if (preferencesLicenceHideValue.text === "0") {
		licence.visible = true;
	} else {
		licence.visible   = false;
	}
}
//=====================
//End function
//=====================


//===========================================
// this function opens the download URL
//===========================================
function menuitem12OnClick(Sender)
{
          if (confirm2("Download latest version of the widget - this button opens a browser window and connects to the widget download page where you can check and download the latest zipped .WIDGET file). Proceed?"))
          {
              openURL("http://lightquick.co.uk/downloads/panzer-disc-storage-gauge-xwidget.html?Itemid=558");
          }
}
//=====================
//End function
//=====================




//=========================================================================
// this function reloads the widget - but it doesn't...
//=========================================================================
function menuitem14OnClick(Sender)
{
         widget.ForceToFround();
         wsc.SendKeys("{f5}");
}
//=====================
//End function
//=====================

//===========================================
// this function opens the browser to the LQ instructions URL
//===========================================
function text2OnMouseDown(Sender,Button,Shift,X,Y)
{
  OpenURL("http://lightquick.co.uk/instructions-for-the-panzer-clock-widget.html");
}
//=====================
//End function
//=====================





//======================================================================================
// Function to end animation on general stopwatch keypresses
//======================================================================================
function setAnimationDone(){
//print("HELLO!");
    animationBusy = false;
}
//=====================
//End function
//=====================

//======================================================================================
// Function to end animation on keypress7 alone
//======================================================================================
function setAnimation7Done(){
//print("HELLO!");
    animationBusy = false;
    stopWatchState = 0;
}
//=====================
//End function
//=====================




//======================================================================================
// Function to perform commands
//======================================================================================
function performCommand() {
    
    print("preferencesimageCmdPrefvalue.text "+preferencesimageCmdPrefvalue.text);
    if ( preferencesimageCmdPrefvalue.text == "" )
    {
        if (confirm2("This widget has not been assigned a double-click function yet - You need to open the preferences and set a function for this widget. Do you wish to proceed?"))
        {
             showWidgetPreferences.visible = true;
        }
    } else {
        if (preferencessoundprefvalue.text != "disabled") {
                PlaySound(ting);
        }
        run(preferencesimageCmdPrefvalue.text);
    }
}
//=====================
//End function
//=====================

//=========================================================================
// this function links the URL on the top of the preferences page
//=========================================================================
function linkOnClick(Sender)
{
          if (confirm2("Visiting the widgets page - this button opens a browser window and connects to our widgets page where you can view the other widgets. Proceed?"))
          {
                   openURL("http://lightquick.co.uk/steampunk-widgets.html?Itemid=264");
          }
}
//=====================
//End function
//=====================

//=========================================================================
// this function replicates the function of a checkbox because Xwidget checkbox
// logic did not always work.
//=========================================================================
function soundbuttonOnMouseDown(Sender,Button,Shift,X,Y)
{
  if (preferencessoundprefvalue.text === "enabled")
  {
      preferencessoundprefvalue.text = "disabled";
      soundbutton.src="bell.png";
  }
  else
  {
      preferencessoundprefvalue.text = "enabled";
      soundbutton.src="bellpushed.png";
  }
  PlaySound(buzzer);    //no test required - this won't sound when the mute is set
}
//=====================
//End function
//=====================


//=========================================================================
// this function saves the preferences to an ini file for later use
//=========================================================================
function saveButtonOnClick(Sender)
{
         makeGaugeVisible();
         //print("preferencesimageCmdPrefvalue.text "+preferencesimageCmdPrefvalue.text);
         settooltip();
         savePrefs();    // prefs are also saved every 10s automatically by a timer as the prefs aren't saved by Xwidget as they are changed.
         sleep (100); // stops the widget prefs appearing in a different position

         widgetOnLoad();
}
//=====================
//End function
//=====================






//=========================================================================
// this function sets the preference values to the defaults for this widget
//=========================================================================
function defaultbuttonOnClick(Sender)
{
         preferenceshoffsetprefvalue.text= "100";
         preferencesvoffsetprefvalue.text= "350";
         preferenceswidgetTooltipvalue.text= "Double-Click on me to set the widget command";
         preferencesimageCmdPrefvalue.text= "control timedate.cpl";
         preferencessoundprefvalue.text="enabled";
         preferencesGaugeSizevalue.percent = "100";
         preferencesLicenceHideValue.text="0";
         preferencesMouseWheelPrefValue.text="up";
}
//=====================
//End function
//=====================


//=========================================================================
// this function ets the mouse schroll wheel to resize one way or another
//=========================================================================
function scrollButtonOnMouseDown(Sender,Button,Shift,X,Y)
{
        if (preferencesMouseWheelPrefValue.text === "up" ) {
               preferencesMouseWheelPrefValue.text = "down" ;
        } else {
               preferencesMouseWheelPrefValue.text = "up"  ;

        }
}
//=====================
//End function
//=====================


//==============================================================
// this function sets the tooltips 
//==============================================================
function settooltip() {
    print("settooltip");
    print("preferencesHintPrefValue.text " + preferencesHintPrefValue.text);
    if ( preferencesHintPrefValue.text == "enabled" ) {
    
        if ( preferenceswidgetTooltipvalue.text != "" )
        {
             background.hint = preferenceswidgetTooltipvalue.text;
        } else {
              //not all of these hints are enabled on the Xwidget version as the tooltip is annoying
              if ( preferencesimageCmdPrefvalue.text == "" ) {
                 background.hint = "Double click on me to assign a double-click function to this widget";
              } else {
                 background.hint = "Current command is - " + preferencesimageCmdPrefvalue.text;
             }
        }
        startButton.hint = "Press to zero the stopwatch dials.";
        stopButton.hint = "Press to continue the timing run. This button is active only when a timing run has been paused";    
        changeDriveButton.hint = "Press to switch the dial faces.";
        prefs.hint = "Press to open the widget preferences";
        helpButton.hint = "Press for a little help";
        pin.hint = "Press to lock the widget in place";
        lamp.hint = "The disc space indicator lamp";
        actionSwitch.hint = "";     
    } else {
        background.hint = "";
        startButton.hint = "";
        stopButton.hint = "";
        changeDriveButton.hint = "";
        prefs.hint = "";
        helpButton.hint = "";
        pin.hint = "";
        lamp.hint = "";
        actionSwitch.hint = "";        
    }
}
//=====================
//End function
//=====================

//===========================================
// this function captures the mouse wheel down event and resizes the clock
//===========================================
function backgroundOnMouseWheelUp(Sender,Key,KeyChar,Shift)
{
         //print("here!");
         size = Scale;
         step = Math.round((maxLength - minLength) / (ticks - 1));
	        if ( preferencesMouseWheelPrefValue.text == "up" ) {
                   size += step;
	           if (size > maxLength) {
	              size = maxLength;
	           }
                } else {
                   size -= step;                
                   if (size < minLength) {
	               size = minLength;
                   }
                 }   
     
     gaugeFace.scaleto(size/100,size/100,0.0000000001,"topleft");
     Scale = size;
     preferencesGaugeSizevalue.percent = Scale; 
     if (preferencessoundprefvalue.text != "disabled" ) {PlaySound(thhhh);};
     //print("playing sound");    
}
//=====================
//End function
//=====================

//===========================================
// this function captures the mouse wheel down event and resizes the clock
//===========================================
function backgroundOnMouseWheelDown(Sender,Key,KeyChar,Shift)
{       
         //print("here!");
         
         size = Scale;
         step = Math.round((maxLength - minLength) / (ticks - 1));
	        if ( preferencesMouseWheelPrefValue.text == "up" ) {
                   size -= step;
                   if (size < minLength) {
	               size = minLength;
                   }
                } else {
                   size += step;
	           if (size > maxLength) {
	              size = maxLength;
	           }                
                }	 
	        
         
     gaugeFace.scaleto(size/100,size/100,0.0000000001,"topleft");
     Scale = size;
     preferencesGaugeSizevalue.percent = Scale;
     if (preferencessoundprefvalue.text != "disabled" ) {PlaySound(thhhh);};
     //print("playing sound");     
     
}
//=====================
//End function
//=====================


//=========================================================================
// this function closes the preferences window
//=========================================================================
function button1OnClick(Sender)
{
         showWidgetPreferences.visible = false;

}
//=====================
//End function
//=====================


//=========================================================================
// this function states the slider size in percentage in the little box on the prefs page
//=========================================================================
function preferencessizePrefvalueOnChange(Sender)
{
     var  adjustedVal =      preferencesGaugeSizevalue.percent ;
     preferencesGaugeSizevalue.hint =     "The widget size will be "  + adjustedVal + "%";
     widgetSize.text =     adjustedVal +"%";
}
//=====================
//End function
//=====================


//==============================================================
// function to resize all images using the gaugeFace single layer
//==============================================================
function resize() {
    print("preferencesGaugeSizevalue.percent "+ preferencesGaugeSizevalue.percent);
    Scale = Number(preferencesGaugeSizevalue.percent);
    gaugeFace.scaleto(Scale/100,Scale/100,0.0000000001,"topleft");
    if (preferencessoundprefvalue.text != "disabled" ) {PlaySound(till);};
    //print("playing sound");         
}
//=====================
//End function
//=====================


//===========================================
// this function shows one face or the other
//===========================================
function startButtonOnMouseDown(Sender,Button,Shift,X,Y)
{       
    startButton.FadeTo(0,0.2);
     widget.cmd("!CreateNew");
    //Xwidget cannot play two sounds simultaneously
    //if (preferencessoundprefvalue.text != "disabled" ) {PlaySound2(ting);};
}
//=====================
//End function
//=====================





//===========================================
// this function shows the start button
//===========================================
function startButtonOnMouseUp(Sender,Button,Shift,X,Y)
{
  
  startButton.FadeToVisible(255,0.2);
}
//=====================
//End function
//=====================



//===========================================
// this function hanges the stopwatch state
//===========================================
function stopButtonOnMouseDown(Sender,Button,Shift,X,Y) {

    if (stopWatchState === 6) {
        stopWatchState = 8;
        if (preferencessoundprefvalue.text != "disabled" ) {PlaySound(counter);};
        if (preferencessoundprefvalue.text != "disabled" ) {PlaySound(ting);};      
    } else {
        if (preferencessoundprefvalue.text != "disabled" ) {PlaySound(mistake);};
    }
    stopButton.FadeTo(0,0.2);
};
//=====================
//End function
//=====================

//===========================================
// this function shows the stopbutton when unpressed
//===========================================
function stopButtonOnMouseUp(Sender,Button,Shift,X,Y) {

    stopButton.FadeToVisible(255,0.2);
}
//=====================
//End function
//=====================



//=========================================================================
// this function replicates the function of a checkbox because Xwidget checkbox
// logic did not always work.
//=========================================================================
function hintsButtonOnMouseDown(Sender,Button,Shift,X,Y)
{
  if (preferencesHintPrefValue.text == "enabled")
  {
      preferencesHintPrefValue.text = "disabled";
      hintsButton.src="bell.png";
  }
  else
  {
      preferencesHintPrefValue.text = "enabled";
      hintsButton.src="bellpushed.png";
  }
  PlaySound(buzzer);    //no test required - this won't sound when the mute is set
  settooltip();
}
//=====================
//End function
//=====================






//======================================================================================
//
//======================================================================================
function prefsOnMouseDown(Sender,Button,Shift,X,Y)
{
       prefs.src="prefs02.png";
}





//==============================
// unlocks the widget
//==============================
function pinOnMouseDown(Sender,Button,Shift,X,Y)
{
	lockWidget();
}
//==============================
//
//==============================



//======================================================================================
// Function to lock the widget
//======================================================================================
function lockWidget () {
        print ( "lockWidget ");
        print ( "widget.lockposition before "+ widget.lockposition);
	if (widget.lockposition == -1 ) {
                pin.opacity = 0;
                widget.lockposition = 0;
                preferenceswidgetLockLandscapeModePrefvalue.text = "disabled";
                //print ( "unlocking Widget ");
                if ( preferencesHintPrefValue.text == "enabled" ) {pin.hint="click me to lock the widget in place";};
	} else {
                pin.opacity = 255;
                widget.lockposition = -1;
                preferenceswidgetLockLandscapeModePrefvalue.text = "enabled";
                //print ( "locking Widget ");
 	        if ( preferencesHintPrefValue.text == "enabled" ) {pin.hint="click me to unlock";};
        }
        if (preferencessoundprefvalue.text != "disabled" ) {PlaySound(lock);};

        //print ( "preferencessoundprefvalue.text "+ preferencessoundprefvalue.text);
        print ( "widget.lockposition after "+ widget.lockposition);

        preferenceshoffsetprefvalue.text = widget.left;
        preferencesvoffsetprefvalue.text = widget.top;
        savePrefs();
}
//=====================
//End function
//=====================




//======================================================================================
//
//======================================================================================

function tankHelpOnMouseDown(Sender,Button,Shift,X,Y)
{
    tankHelp.visible=false;
      if (preferencessoundprefvalue.text != "disabled" ) {PlaySound(ting);};    
}




//======================================================================================
//
//======================================================================================
function helpButtonOnMouseUp(Sender,Button,Shift,X,Y)
{
      tankHelp.visible=true;
      helpButton.opacity=0;
      if (preferencessoundprefvalue.text != "disabled" ) {PlaySound(till);};      
}


//======================================================================================
//
//======================================================================================
function helpButtonOnMouseDown(Sender,Button,Shift,X,Y)
{
       helpButton.opacity=255;
}



//======================================================================================
// Function to lock the widget on startup
//======================================================================================
function checkLockWidget ()        {

           if (preferenceswidgetLockLandscapeModePrefvalue.text == "disabled") {
                pin.opacity = 0;
                widget.lockposition = false;
	        // this does not work yet
	        if ( preferencesHintPrefValue.text == "enabled" ) {pin.hint="click me to lock the widget in place";};
	        //screw2.tooltip="click me to lock the widget in place";
                 return;
           } else {
                 print("checkLockWidget locking in landscape");
                 print("preferenceswidgetLockLandscapeModePrefvalue.text " +preferenceswidgetLockLandscapeModePrefvalue.text);
                 pin.opacity = 255;
                 widget.lockposition = true;
                 if (preferencessoundprefvalue.text != "disabled" ) {PlaySound(lock);};
                 
                // check if the widget has a lock for the screen type.
	         if ( preferencesHintPrefValue.text == "enabled" ) {pin.hint="click me to unlock";};
          }
}
//=====================
//End function
//=====================











//======================================================================================
// 
//======================================================================================
function actionSwitchOnMouseUp(Sender,Button,Shift,X,Y)
{
        actionSwitch.opacity=0;
        savePrefs();
}
//=====================
//End function
//=====================

 


//======================================================================================
//
//======================================================================================
function changeDriveButtonOnMouseDown(Sender,Button,Shift,X,Y)
{
          driveCounter = driveCounter + 1;
          if (driveCounter > 6) {driveCounter = 1}; 
          if (preferencessoundprefvalue.text != "disabled" ) {PlaySound(till);};

          
          if (driveCounter == 1) {
              diskcore1.enabled = true;
              diskcore6.enabled = false;
              driveLetter.src="C-image.png";
              disk1HandLayer.visible = true;
              disk6HandLayer.visible = false;
          };

          if (driveCounter == 2) {
              diskcore2.enabled = true;
              diskcore1.enabled = false;
              spaceFreeText2.enabled = true;
              spaceFreeText1.enabled = false;
              driveLetter.src="D-image.png";
              disk2HandLayer.visible = true;
              disk1HandLayer.visible = false;
          };
          if (driveCounter == 3) {
              diskcore3.enabled = true;
              diskcore2.enabled = false;
              spaceFreeText3.enabled = true;
              spaceFreeText2.enabled = false;
              driveLetter.src="E-image.png";
              disk3HandLayer.visible = true;
              disk2HandLayer.visible = false;
          };
          if (driveCounter == 4) {
              diskcore4.enabled = true;
              diskcore3.enabled = false;
              spaceFreeText4.enabled = true;
              spaceFreeText3.enabled = false;
              driveLetter.src="F-image.png";
              disk4HandLayer.visible = true;
              disk3HandLayer.visible = false;
          };
          if (driveCounter == 5) {
              diskcore5.enabled = true;
              diskcore4.enabled = false;
              spaceFreeText5.enabled = true;
              spaceFreeText4.enabled = false;
              driveLetter.src="G-image.png";
              disk5HandLayer.visible = true;
              disk4HandLayer.visible = false;
          };
          if (driveCounter == 6) {
              diskcore6.enabled = true;
              diskcore5.enabled = false;
              spaceFreeText6.enabled = true;
              spaceFreeText5.enabled = false;
              driveLetter.src="H-image.png";
              disk6HandLayer.visible = true;
              disk5HandLayer.visible = false;
          };
          
          checkSpace();
}
//=====================
//End function
//=====================


//======================================================================================
// Function to check whether there is space
//======================================================================================
function checkSpace() {
   //print("spaceFreeText.text "+spaceFreeText.text);


   if (driveCounter == 1) { var dd = spaceFreeText1.text;};
   if (driveCounter == 2) { var dd = spaceFreeText2.text;};
   if (driveCounter == 3) { var dd = spaceFreeText3.text;};
   if (driveCounter == 4) { var dd = spaceFreeText4.text;};
   if (driveCounter == 5) { var dd = spaceFreeText5.text;};
   if (driveCounter == 6) { var dd = spaceFreeText6.text;};
   if (dd < 80)  {
         lamp.src = "green-lamptrue.png";
   } else {
         lamp.src = "red-lamptrue.png";
   }
}
//=====================
//End function
//=====================



function savebuttonOnKeyDown(Sender,Key,KeyChar,Shift)
{
        saveButtonOnClick();
}


function switchOffFunctions()
{
    diskcore1.enabled = false;
    diskcore2.enabled = false;
    diskcore3.enabled = false;
    diskcore4.enabled = false;
    diskcore5.enabled = false;
    diskcore6.enabled = false;
    timercore1.enabled = false;
    disk1HandLayer.visible = false
    disk2HandLayer.visible = false
    disk3HandLayer.visible = false
    disk4HandLayer.visible = false
    disk5HandLayer.visible = false
    disk6HandLayer.visible = false
}


function tickSwitchOnMouseDown(Sender,Button,Shift,X,Y)
{
  if (preferencessoundprefvalue.text != "disabled" ) {
     print("preferencessoundprefvalue.text "+preferencessoundprefvalue.text);
     PlaySound(lock);
  };

  if (preferencesActionSwitchPrefValue.text === "tick" ) {
    preferencesActionSwitchPrefValue.text = "continuous";
    //print("preferencesActionSwitchPrefValue.text "+preferencesActionSwitchPrefValue.text);
    disk1Pointer.enabledAnimateChange=-1;
    disk1PointerShadow.enabledAnimateChange=-1;
    disk2Pointer.enabledAnimateChange=-1;
    disk2PointerShadow.enabledAnimateChange=-1;
    disk3Pointer.enabledAnimateChange=-1;
    disk3PointerShadow.enabledAnimateChange=-1;
    disk4Pointer.enabledAnimateChange=-1;
    disk4PointerShadow.enabledAnimateChange=-1;
    disk5Pointer.enabledAnimateChange=-1;
    disk6PointerShadow.enabledAnimateChange=-1;
    disk6Pointer.enabledAnimateChange=-1;
    disk6PointerShadow.enabledAnimateChange=-1;
  } else {
    preferencesActionSwitchPrefValue.text = "tick";
    disk1Pointer.enabledAnimateChange=0;
    disk1PointerShadow.enabledAnimateChange=0;
    disk2Pointer.enabledAnimateChange=0;
    disk2PointerShadow.enabledAnimateChange=0;
    disk3Pointer.enabledAnimateChange=0;
    disk3PointerShadow.enabledAnimateChange=0;
    disk4Pointer.enabledAnimateChange=0;
    disk4PointerShadow.enabledAnimateChange=0;
    disk5Pointer.enabledAnimateChange=0;
    disk6PointerShadow.enabledAnimateChange=0;
    disk6Pointer.enabledAnimateChange=0;
    disk6PointerShadow.enabledAnimateChange=0;
  }
          savePrefs();
}


function widgetOnEnter()
{

  prefsSaveTimer.enabled=true;
}

function widgetOnLeave()
{
  prefsSaveTimer.enabled=false;
}


function menuitem21OnClick(Sender)
{
  helpButtonOnMouseUp();
}




//=========================================================================
// this function sets the action switch (ticking) to saved values
//=========================================================================
function setActionSwitch(){
  if (preferencesActionSwitchPrefValue.text === "tick" ) {
    disk1Pointer.enabledAnimateChange=0;
    disk1PointerShadow.enabledAnimateChange=0;
    disk2Pointer.enabledAnimateChange=0;
    disk2PointerShadow.enabledAnimateChange=0;
    disk3Pointer.enabledAnimateChange=0;
    disk3PointerShadow.enabledAnimateChange=0;
    disk4Pointer.enabledAnimateChange=0;
    disk4PointerShadow.enabledAnimateChange=0;
    disk5Pointer.enabledAnimateChange=0;
    disk6PointerShadow.enabledAnimateChange=0;
    disk6Pointer.enabledAnimateChange=0;
    disk6PointerShadow.enabledAnimateChange=0;
  } else {
    disk1Pointer.enabledAnimateChange=-1;
    disk1PointerShadow.enabledAnimateChange=-1;
    disk2Pointer.enabledAnimateChange=-1;
    disk2PointerShadow.enabledAnimateChange=-1;
    disk3Pointer.enabledAnimateChange=-1;
    disk3PointerShadow.enabledAnimateChange=-1;
    disk4Pointer.enabledAnimateChange=-1;
    disk4PointerShadow.enabledAnimateChange=-1;
    disk5Pointer.enabledAnimateChange=-1;
    disk6PointerShadow.enabledAnimateChange=-1;
    disk6Pointer.enabledAnimateChange=-1;
    disk6PointerShadow.enabledAnimateChange=-1;
  }
  print("preferencesActionSwitchPrefValue.text "+preferencesActionSwitchPrefValue.text);
}
//=====================
//End function
//=====================
function findWidget(Sender)
{
  open(WidgetPath);
}