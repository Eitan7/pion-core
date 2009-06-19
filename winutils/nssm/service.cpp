#include "nssm.h"

SERVICE_STATUS service_status;
SERVICE_STATUS_HANDLE service_handle;
HANDLE wait_handle;
HANDLE pid;
DWORD dwPid;
char exe[MAX_PATH];
char flags[MAX_PATH];
char dir[MAX_PATH];

/* Connect to the service manager */
SC_HANDLE open_service_manager() {
  SC_HANDLE ret = OpenSCManager(0, SERVICES_ACTIVE_DATABASE, SC_MANAGER_ALL_ACCESS);
  if (! ret) {
    eventprintf(EVENTLOG_ERROR_TYPE, "Unable to connect to service manager!\nPerhaps you need to be an administrator...");
    return 0;
  }

  return ret;
}

/* About to install the service */
int pre_install_service(int argc, char **argv) {
  /* Show the dialogue box if we didn't pass service-name and program */
  if (argc < 2) return nssm_gui(IDD_INSTALL, argv[0], NULL, NULL);

  /* Arguments are optional */
  char *flags;
  if (argc == 2) flags = "";
  else flags = argv[2];

  return install_service(argv[0], argv[0], "", argv[1], flags);
}

/* About to install the service (advanced) */
int pre_install2_service(int argc, char **argv) {
  /* Show the dialogue box if we didn't pass service-name, display-name, description, and program */
  if (argc < 4) return nssm_gui(IDD_INSTALL, argv[0], argc > 0 ? argv[1] : NULL, argc > 1 ? argv[2] : NULL);

  /* Arguments are optional */
  char *flags;
  if (argc == 4) flags = "";
  else flags = argv[4];

  return install_service(argv[0], argv[1], argv[2], argv[3], flags);
}

/* About to remove the service */
int pre_remove_service(int argc, char **argv) {
  /* Show dialogue box if we didn't pass service-name and "confirm" */
  if (argc < 2) return nssm_gui(IDD_REMOVE, argv[0], NULL, NULL);
  if (str_equiv(argv[1], "confirm")) return remove_service(argv[0]);
  fprintf(stderr, "To remove a service without confirmation: nssm remove <servicename> confirm\n");
  return 100;
}

/* Install the service */
int install_service(char *name, char *disp, char *desc, char *exe, char *flags) {
  /* Open service manager */
  SC_HANDLE services = open_service_manager();
  if (! services) {
    fprintf(stderr, "Error opening service manager!\n");
    return 2;
  }

  /* To cons, or not to cons... */
  char *run = console ? NSSM_RUNCONS : NSSM_RUN;

  /* Get path of this program */
  char path[MAX_PATH];
  GetModuleFileName(0, path, MAX_PATH);

  /* Construct command */
  char command[MAX_PATH];
  int runlen = strlen(run);
  int pathlen = strlen(path);
  if (pathlen + runlen + 2 >= MAX_PATH) {
    fprintf(stderr, "The full path to " NSSM " is too long!\n");
    return 3;
  }
  if (snprintf(command, sizeof(command), "\"%s\" %s", path, run) < 0) {
    fprintf(stderr, "Out of memory for ImagePath!\n");
    return 4;
  }

  /* Work out directory name */
  unsigned int len = strlen(exe);
  unsigned int i;
  for (i = len; i && exe[i] != '\\' && exe[i] != '/'; i--);
  char dir[MAX_PATH];
  memmove(dir, exe, i);
  dir[i] = '\0';

  /* Create the service */
  SC_HANDLE service = CreateService(services, name, disp, SC_MANAGER_ALL_ACCESS, SERVICE_WIN32_OWN_PROCESS, SERVICE_AUTO_START, SERVICE_ERROR_NORMAL, command, 0, 0, 0, 0, 0);
  if (! service) {
    fprintf(stderr, "Error creating service!\n");
    CloseServiceHandle(services);
    return 5;
  }

  /* Set the description */
  SERVICE_DESCRIPTION sd;
  sd.lpDescription = desc;
  if (! ChangeServiceConfig2(service, SERVICE_CONFIG_DESCRIPTION, &sd)) {
    fprintf(stderr, "Error setting service description!\n");
    DeleteService(service);
    CloseServiceHandle(services);
    return 6;
  }

  /* Now we need to put the parameters into the registry */
  if (create_parameters(name, exe, flags, dir)) {
    fprintf(stderr, "Error setting startup parameters for the service!\n");
    DeleteService(service);
    CloseServiceHandle(services);
    return 7;
  }

  /* Cleanup */
  CloseServiceHandle(service);
  CloseServiceHandle(services);

  printf("Service \"%s\" installed successfully!\n", name);
  return 0;
}

/* Remove the service */
int remove_service(char *name) {
  /* Open service manager */
  SC_HANDLE services = open_service_manager();
  if (! services) {
    fprintf(stderr, "Error opening service manager!\n");
    return 2;
  }
  
  /* Try to open the service */
  SC_HANDLE service = OpenService(services, name, SC_MANAGER_ALL_ACCESS);
  if (! service) {
    fprintf(stderr, "Can't open service!");
    CloseServiceHandle(services);
    return 3;
  }

  /* Try to delete the service */
  if (! DeleteService(service)) {
    fprintf(stderr, "Error deleting service!\n");
    CloseServiceHandle(service);
    CloseServiceHandle(services);
    return 4;
  }

  /* Cleanup */
  CloseServiceHandle(service);
  CloseServiceHandle(services);

  printf("Service \"%s\" removed successfully!\n", name);
  return 0;
}

/* Service initialisation */
void WINAPI service_main(unsigned long argc, char **argv) {
  /* Initialise status */
  ZeroMemory(&service_status, sizeof(service_status));
  service_status.dwServiceType = SERVICE_WIN32_OWN_PROCESS | SERVICE_INTERACTIVE_PROCESS;
  service_status.dwCurrentState = SERVICE_RUNNING;
  service_status.dwControlsAccepted = SERVICE_ACCEPT_SHUTDOWN | SERVICE_ACCEPT_STOP;
  service_status.dwWin32ExitCode = NO_ERROR;
  service_status.dwServiceSpecificExitCode = 0;
  service_status.dwCheckPoint = 0;
  service_status.dwWaitHint = 1000;

  /* Signal we AREN'T running the server */
  pid = 0;

  /* Get startup parameters */
  int ret = get_parameters(argv[0], exe, sizeof(exe), flags, sizeof(flags), dir, sizeof(dir));
  if (ret) {
    eventprintf(EVENTLOG_ERROR_TYPE, "service_main(): Can't get startup parameters: error %d", ret);
    return;
  }

  /* Register control handler */
  service_handle = RegisterServiceCtrlHandlerEx(NSSM, service_control_handler, 0);
  if (! service_handle) {
    eventprintf(EVENTLOG_ERROR_TYPE, "service_main(): RegisterServiceCtrlHandlerEx() failed: %s", error_string(GetLastError()));
    return;
  }

  monitor_service();
}

int monitor_service() {
  /* Set service status to started */
  int ret = start_service();
  if (ret) {
    eventprintf(EVENTLOG_ERROR_TYPE, "Can't start service: error code %d", ret);
    return ret;
  }
  eventprintf(EVENTLOG_INFORMATION_TYPE, "Started process %s %s in %s", exe, flags, dir);

  /* Monitor service service */
  if (! RegisterWaitForSingleObject(&wait_handle, pid, end_service, 0, INFINITE, WT_EXECUTEONLYONCE | WT_EXECUTELONGFUNCTION)) {
    eventprintf(EVENTLOG_WARNING_TYPE, "RegisterWaitForSingleObject() returned %s - service may claim to be still running when %s exits ", error_string(GetLastError()), exe);
  }

  return 0;
}

/* Service control handler */
unsigned long WINAPI service_control_handler(unsigned long control, unsigned long event, void *data, void *context) {
  switch (control) {
    case SERVICE_CONTROL_SHUTDOWN:
    case SERVICE_CONTROL_STOP:
      stop_service(0);
      return NO_ERROR;
  }

  /* Unknown control */
  return ERROR_CALL_NOT_IMPLEMENTED;
}

/* Start the service */
int start_service() {
  if (pid) return 0;

  /* Allocate a STARTUPINFO structure for a new process */
  STARTUPINFO si;
  ZeroMemory(&si, sizeof(si));
  si.cb = sizeof(si);

  /* Allocate a PROCESSINFO structure for the process */
  PROCESS_INFORMATION pi;
  ZeroMemory(&pi, sizeof(pi));

  /* Launch executable with arguments */
  char cmd[MAX_PATH];
  if (_snprintf(cmd, sizeof(cmd), "%s %s", exe, flags) < 0) {
    eventprintf(EVENTLOG_ERROR_TYPE, "Error constructing command line");
    return stop_service(2);
  }
  if (! CreateProcess(0, cmd, 0, 0, 0, CREATE_NEW_PROCESS_GROUP, 0, dir, &si, &pi)) {
    eventprintf(EVENTLOG_ERROR_TYPE, "Can't launch %s.  CreateProcess() returned %s", exe, error_string(GetLastError()));
    return stop_service(3);
  }
  pid = pi.hProcess;
  dwPid = pi.dwProcessId;

  /* Signal successful start */
  service_status.dwCurrentState = SERVICE_RUNNING;
  SetServiceStatus(service_handle, &service_status);

  return 0;
}

/* Stop the service */
int stop_service(unsigned long exitcode) {
  int terminate = 1;
  /* Signal we are stopping */
  service_status.dwCurrentState = SERVICE_STOP_PENDING;
  SetServiceStatus(service_handle, &service_status);

  /* Nothing to do if server isn't running */
  if (pid) {
    /* Shut down server */
    if (console) {
      GenerateConsoleCtrlEvent(CTRL_BREAK_EVENT, dwPid);
      terminate = (WaitForSingleObject(pid, 30000) == WAIT_OBJECT_0) ? 0 : 1;
    }
    if (terminate) TerminateProcess(pid, 0);
    while (pid != 0) Sleep(250);
  }

  /* Signal we stopped */
  service_status.dwCurrentState = SERVICE_STOPPED;
  if (exitcode) {
    service_status.dwWin32ExitCode = ERROR_SERVICE_SPECIFIC_ERROR;
    service_status.dwServiceSpecificExitCode = exitcode;
  }
  else {
    service_status.dwWin32ExitCode = NO_ERROR;
    service_status.dwServiceSpecificExitCode = 0;
  }
  SetServiceStatus(service_handle, &service_status);

  return exitcode;
}

/* Callback function triggered when the server exits */
void CALLBACK end_service(void *arg, unsigned char why) {
  /* Check exit code */
  unsigned long ret = 0;
  GetExitCodeProcess(pid, &ret);
  UnregisterWait(wait_handle);

  /* Force an error code if none given, so system can restart this service */
  /*if (! ret) {
    eventprintf(EVENTLOG_INFORMATION_TYPE, "Process exited with return code 0 - overriding with return code 111 so the service manager will notice the failure");
    ret = 111;
  }
  else */eventprintf(EVENTLOG_INFORMATION_TYPE, "Process %s exited with return code %u", exe, ret);

  /* Try to restart the service or return failure code to service manager */
  pid = 0;
  while (service_status.dwCurrentState == SERVICE_RUNNING && monitor_service()) {
    eventprintf(EVENTLOG_INFORMATION_TYPE, "Failed to restart %s - sleeping ", exe, ret);
    Sleep(30000);
  }
}
