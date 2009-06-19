#ifndef GUI_H
#define GUI_H

#include <stdio.h>
#include <windows.h>
#include <commctrl.h>
#include "resource.h"

#define GUI
#ifndef snprintf
#define snprintf _snprintf
#endif

#define STRING_SIZE 256

int nssm_gui(int, char *, char *, char *);
void centre_window(HWND);
int install(HWND);
int remove(HWND);
void browse(HWND);
int CALLBACK install_dlg(HWND, UINT, WPARAM, LPARAM);

#endif
