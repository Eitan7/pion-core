# -----------------------------------------
# pion-platform automake configuration file 
# -----------------------------------------

AM_CPPFLAGS = -I@PION_COMMON_HOME@/include -I../include @PYTHON_CSPEC@

EXTRA_LTLIBRARIES = PythonReactor.la

pion_pluginsdir = @PION_PLUGINS_DIRECTORY@
pion_plugins_LTLIBRARIES = FilterReactor.la TransformReactor.la \
	LogInputReactor.la LogOutputReactor.la DatabaseOutputReactor.la \
	ScriptReactor.la FissionReactor.la @PION_PYTHON_REACTOR@

FilterReactor_la_CXXFLAGS = -shared $(AM_CXXFLAGS)
FilterReactor_la_SOURCES = FilterReactor.hpp FilterReactor.cpp
FilterReactor_la_LDFLAGS = -no-undefined -module -avoid-version
FilterReactor_la_LIBADD = ../src/libpion-platform.la @PION_COMMON_LIB@ @PION_EXTERNAL_LIBS@ @PION_PLATFORM_LIBS@
FilterReactor_la_DEPENDENCIES = ../src/libpion-platform.la @PION_COMMON_LIB@

TransformReactor_la_CXXFLAGS = -shared $(AM_CXXFLAGS)
TransformReactor_la_SOURCES = TransformReactor.hpp TransformReactor.cpp
TransformReactor_la_LDFLAGS = -no-undefined -module -avoid-version
TransformReactor_la_LIBADD = ../src/libpion-platform.la @PION_COMMON_LIB@ @PION_EXTERNAL_LIBS@ @PION_PLATFORM_LIBS@
TransformReactor_la_DEPENDENCIES = ../src/libpion-platform.la @PION_COMMON_LIB@

LogInputReactor_la_CXXFLAGS = -shared $(AM_CXXFLAGS)
LogInputReactor_la_SOURCES = LogInputReactor.hpp LogInputReactor.cpp
LogInputReactor_la_LDFLAGS = -no-undefined -module -avoid-version
LogInputReactor_la_LIBADD = ../src/libpion-platform.la @PION_COMMON_LIB@ @PION_EXTERNAL_LIBS@ @PION_PLATFORM_LIBS@
LogInputReactor_la_DEPENDENCIES = ../src/libpion-platform.la @PION_COMMON_LIB@

LogOutputReactor_la_CXXFLAGS = -shared $(AM_CXXFLAGS)
LogOutputReactor_la_SOURCES = LogOutputReactor.hpp LogOutputReactor.cpp
LogOutputReactor_la_LDFLAGS = -no-undefined -module -avoid-version
LogOutputReactor_la_LIBADD = ../src/libpion-platform.la @PION_COMMON_LIB@ @PION_EXTERNAL_LIBS@ @PION_PLATFORM_LIBS@
LogOutputReactor_la_DEPENDENCIES = ../src/libpion-platform.la @PION_COMMON_LIB@

DatabaseOutputReactor_la_CXXFLAGS = -shared $(AM_CXXFLAGS)
DatabaseOutputReactor_la_SOURCES = DatabaseOutputReactor.hpp DatabaseOutputReactor.cpp
DatabaseOutputReactor_la_LDFLAGS = -no-undefined -module -avoid-version
DatabaseOutputReactor_la_LIBADD = ../src/libpion-platform.la @PION_COMMON_LIB@ @PION_EXTERNAL_LIBS@ @PION_PLATFORM_LIBS@
DatabaseOutputReactor_la_DEPENDENCIES = ../src/libpion-platform.la @PION_COMMON_LIB@

ScriptReactor_la_CXXFLAGS = -shared $(AM_CXXFLAGS)
ScriptReactor_la_SOURCES = ScriptReactor.hpp ScriptReactor.cpp
ScriptReactor_la_LDFLAGS = -no-undefined -module -avoid-version
ScriptReactor_la_LIBADD = ../src/libpion-platform.la @PION_COMMON_LIB@ @PION_EXTERNAL_LIBS@ @PION_PLATFORM_LIBS@
ScriptReactor_la_DEPENDENCIES = ../src/libpion-platform.la @PION_COMMON_LIB@

FissionReactor_la_CXXFLAGS = -shared $(AM_CXXFLAGS)
FissionReactor_la_SOURCES = FissionReactor.hpp FissionReactor.cpp
FissionReactor_la_LDFLAGS = -no-undefined -module -avoid-version
FissionReactor_la_LIBADD = ../src/libpion-platform.la @PION_COMMON_LIB@ @PION_EXTERNAL_LIBS@ @PION_PLATFORM_LIBS@
FissionReactor_la_DEPENDENCIES = ../src/libpion-platform.la @PION_COMMON_LIB@

PythonReactor_la_CXXFLAGS = -shared $(AM_CXXFLAGS)
PythonReactor_la_SOURCES = PythonReactor.hpp PythonReactor.cpp
PythonReactor_la_LDFLAGS = -no-undefined -module -avoid-version -rpath '@PION_PLUGINS_DIRECTORY@'
PythonReactor_la_LIBADD = ../src/libpion-platform.la @PION_COMMON_LIB@ @PION_EXTERNAL_LIBS@ @PION_PLATFORM_LIBS@ @PYTHON_LSPEC@
PythonReactor_la_DEPENDENCIES = ../src/libpion-platform.la @PION_COMMON_LIB@

EXTRA_DIST = *.vcproj
