#!/bin/bash
# Platform.sh CLI installer

set -euo pipefail

# Location of install log
: "${INSTALL_LOG:=/tmp/platformsh-install-$(date '+%Y%m%d-%H%M%S').log}"

# Define this to force install method
: "${INSTALL_METHOD:=}"

: "${URL:=https://github.com/platformsh/cli/releases/download}"

# Force Platform.sh CLI installation in this directory instead of system directory
: "${INSTALL_DIR:=}"

# Platform.sh CLI version to install
: "${VERSION:=}"

# macOS specifics
: "${BREW_TAP:=platformsh/tap}"
: "${BREW_FORMULA:=platformsh/tap/platformsh-cli}"

# GitHub token check
: "${GITHUB_TOKEN:=}"

# Platform.sh CLI vendor to install
: "${VENDOR:=platformsh}"

# CI specifics
: "${CI:=}"
: "${BUILD_NUMBER:=}"
: "${RUN_ID:=}"

# global variables
binary="platform"
vendor_name="Platform.sh"
cloudsmith_repository="cli"
cmd_shasum=""
cmd_sudo=""
dir_bin="/usr/bin"
footer_notes=""
has_sudo=""
kernel=""
machine=""
version=""
package="platformsh-cli"
docs_url="https://docs.platform.sh"
support_url="https://platform.sh/contact"

if [ "$VENDOR" == "upsun" ]; then
    BREW_FORMULA="platformsh/tap/upsun-cli"
    binary="upsun"
    vendor_name="Upsun"
    package="upsun-cli"
    docs_url="https://docs.upsun.com"
    cloudsmith_repository="upsun-cli"
fi

# create a log file where every output will be pipe to
pipe=/tmp/$binary-install-$$.tmp
mkfifo $pipe
tee < $pipe $INSTALL_LOG &
exec 1>&-
exec 1>$pipe 2>&1
trap 'rm -f $pipe' EXIT

function output {
    style_start=""
    style_end=""
    if [ "${2:-}" != "" ]; then
    case $2 in
        "success")
            style_start="\033[0;32m"
            style_end="\033[0m"
            ;;
        "error")
            style_start="\033[31;31m"
            style_end="\033[0m"
            ;;
        "info"|"warning")
            style_start="\033[33m"
            style_end="\033[39m"
            ;;
        "heading")
            style_start="\033[1;33m"
            style_end="\033[22;39m"
            ;;
        "comment")
            style_start="\033[2m"
            style_end="\033[22;39m"
            ;;
    esac
    fi

    builtin echo -e "${style_start}${1}${style_end}"
}

function exit_with_error() {
    output "+--------------------------------------------------+" "error"
    output "|                                                  |" "error"
    output "|              Installation failed                 |" "error"
    output "|                                                  |" "error"
    output "+--------------------------------------------------+" "error"

    output "\nGet help with your $vendor_name CLI installation:" "heading"
    output "  Inspect the logs: ${INSTALL_LOG}"
    output "  Read the docs: $docs_url/administration/cli.html"
    output "  Get help: $support_url"

    exit 1
}

function intro() {
    output "+--------------------------------------------------+" "heading"
    output "|                                                  |" "heading"
    output "|           $vendor_name CLI Installer              |" "heading"
    output "|                                                  |" "heading"
    output "+--------------------------------------------------+" "heading"

    output "\nChecking environment" "heading"
}

function outro() {
    output ""
    output "+--------------------------------------------------+" "success"
    output "|                                                  |" "success"
    output "| $vendor_name CLI has been installed successfully. |" "success"
    output "|                                                  |" "success"
    output "+--------------------------------------------------+" "success"

    output "\nWhat's next?" "heading"

    output "  To use the CLI, run: $binary" "output"

    output "\nUseful links:" "heading"
    output "  CLI introduction: $docs_url/get-started/introduction.html#cli"

    if [ ! -z "$footer_notes" ]; then
        output "\nWarning during installation:" "heading"
        output "$footer_notes" "warning"
    fi

    output "\nThank you for using $vendor_name!"
}

function add_footer_note() {
    for var in "$@"; do
        if [ ! -z "$footer_notes" ]; then
            footer_notes="${footer_notes}\n${var}"
        else
            footer_notes="${footer_notes}${var}"
        fi
    done
}

function indent() {
    OLDIFS=$IFS
    IFS=$'\n'
    while read -r data; do
        line=$(echo "   | ${data}"|sed $'s/\r/\r   | /g'|sed $'s/\x1B\[[0-9;]\{1,\}[A-Za-z]//g')
        output "$line" "comment"
    done
    IFS=$OLDIFS
}

# Check that cURL is installed
function check_curl() {
    if command -v curl >/dev/null 2>&1; then
        output "  [*] cURL is installed" "success"
        if gh auth status >/dev/null 2>&1; then
            GITHUB_TOKEN="$(gh auth token)"
            if ! github_curl https://api.github.com/repos/platformsh/cli/releases/latest >/dev/null 2>&1; then
                GITHUB_TOKEN=""
            else
                output "  [*] Using GitHub auth from the gh CLI" "success"
            fi
        elif [ ! -z "${GITHUB_TOKEN}" ]; then
            if ! github_curl https://api.github.com/repos/platformsh/cli/releases/latest >/dev/null 2>&1; then
                GITHUB_TOKEN=""
            else
                output "  [*] Using GitHub auth from the GITHUB_TOKEN env variable" "success"
            fi
        fi
    else
        output "  [ ] ERROR: cURL is required for installation" "error"
        exit_with_error
    fi
}

# Check that Gzip is installed
function check_gzip() {
    if command -v gzip >/dev/null 2>&1; then
        output "  [*] Gzip is installed" "success"
    else
        output "  [ ] ERROR: Gzip is required for installation" "error"
        exit_with_error
    fi
}

function check_version() {
    if [ -z "${VERSION}" ]; then
        version=$(curl -I https://github.com/platformsh/cli/releases/latest 2>/dev/null | awk -F/ -v RS='\r\n' '/platformsh.cli.releases.tag/ {printf "%s", $NF}')
        output "  [*] No version specified, using latest ($version)" "success"
    else
        output "  [*] Version ${VERSION} specified" "success"
        version=${VERSION}
    fi
}

# Detect the kernel type
function check_kernel() {
    kernel=$(uname -s 2>$pipe || /usr/bin/uname -s)
    case ${kernel} in
        "Linux"|"linux")
            kernel="linux"
            ;;
        "Darwin"|"darwin")
            kernel="darwin"
            dir_bin="/usr/local/bin"
            ;;
        "FreeBSD"|"freebsd")
            kernel="freebsd"
            ;;
        *)
            output "  [ ] Your OS (${kernel}) is currently not supported" "error"
            exit_with_error
            ;;
    esac

    output "  [*] Your kernel (${kernel}) is supported" "success"
}

function check_architecture() {
    # Detect architecture
    machine=$(uname -m 2>$pipe || /usr/bin/uname -m)
    case ${machine} in
        aarch64*|armv8*|arm64*)
            machine="arm64"
            ;;
        i[36]86|x86)
            machine="386"
            ;;
        x86_64|amd64)
            machine="amd64"
            ;;
        *)
            output "  [ ] Your architecture (${machine}) is currently not supported" "error"
            exit_with_error
            ;;
    esac

    output "  [*] Your architecture (${machine}) is supported" "success"
}

function check_install_method() {
    if [ "linux" = "$kernel" ]; then
        if [ -z "${INSTALL_METHOD}" ]; then
            if is_ci; then
                INSTALL_METHOD="raw"
            elif [ ! -z $VERSION ]; then
                INSTALL_METHOD="raw"
            elif command -v apt-get > /dev/null 2>&1; then
                INSTALL_METHOD="apt"
            elif command -v yum > /dev/null 2>&1; then
                INSTALL_METHOD="yum"
            elif command -v apk > /dev/null 2>&1; then
                INSTALL_METHOD="apk"
            else
                INSTALL_METHOD="raw"
            fi
        fi
    elif [ "darwin" == $kernel ]; then
        if [ -z "${INSTALL_METHOD}" ]; then
            if command -v brew > /dev/null 2>&1
            then
                INSTALL_METHOD="homebrew"
            else
                INSTALL_METHOD="raw"
            fi
        fi
        if [ "${INSTALL_METHOD}" = "raw" ]; then
            machine="all"
        fi
    elif [ "freebsd" == $kernel ]; then
        INSTALL_METHOD="raw"
    fi

    output "  [*] Using ${INSTALL_METHOD} install method" "success"
}

function init_sudo() {
    if [ ! -z "${has_sudo}" ]; then
        return
    fi

    has_sudo=false
    # Are we running the installer as root?
    if [ "$(echo "$UID")" = "0" ]; then
        has_sudo=true
        cmd_sudo=''

        return
    fi

    if command -v sudo > /dev/null 2>&1; then
        has_sudo=true
        cmd_sudo='sudo -E'
    fi
}

function call_root() {
    init_sudo

    if ! ${has_sudo}; then
        output "  sudo is required to perform this operation" "error"
        exit_with_error
    fi

    if $cmd_sudo sh -c "$1" 2>&1 | indent; then
        return 0
    fi

    return 1
}

function call_try_user() {
    if ! call_user "$1"; then
        output "  command failed, re-trying with sudo" "warning"
        if ! call_root "$1"; then
            output "  ${2:-command failed}" "error"
            exit_with_error
        fi
    fi
}

function call_user() {
    sh -c "$1" 2>&1 | indent
}

function check_shasum() {
    if command -v sha1sum > /dev/null 2>&1; then
        cmd_shasum="sha1sum"
        output "  [*] sha1sum is installed" "success"
    elif command -v shasum > /dev/null 2>&1; then
        cmd_shasum="shasum -a 1"
        output "  [*] shasum is installed" "success"
    else
        output "  [ ] No sha1sum or shasum available to verify binary" "error"
        exit_with_error
    fi
}

function check_directories() {
    if [ ! -z "${INSTALL_DIR}" ]; then
        dir_bin="${INSTALL_DIR}"
        INSTALL_METHOD="raw"
    elif echo $PATH | grep "$HOME/.global/bin" > /dev/null; then
        dir_bin="$HOME/.global/bin"
    elif echo $PATH | grep "$HOME/.local/bin" > /dev/null; then
        dir_bin="$HOME/.local/bin"
    fi

    if ! echo $PATH | grep ${dir_bin} > /dev/null; then
        binary="${dir_bin}/$binary"

        output "  [ ] ${dir_bin} is not in \$PATH.\n" "warning"
        add_footer_note "  ⚠ The directory \"${dir_bin}\" is not in \$PATH"
        if echo $SHELL | grep '/bin/zsh' > /dev/null
        then
            add_footer_note \
                "    Run this command to add the directory to your PATH" \
                "    echo 'export PATH=\"${dir_bin}:\$PATH\"' >> \$HOME/.zshrc"
        elif echo $SHELL | grep '/bin/bash' > /dev/null
        then
            add_footer_note \
                "    Run this command to add the directory to your PATH" \
                "    echo 'export PATH=\"${dir_bin}:\$PATH\"' >> \$HOME/.bashrc"
        else
            add_footer_note \
                "    You can add it to your PATH by adding this line at the end of your shell configuration file" \
                "    export PATH=\"${dir_bin}:\$PATH\""
        fi
    else
        output "  [*] ${dir_bin} is in \$PATH" "success"
    fi

    output "\nTarget directories" "heading"
    output "  Binary will be installed in ${dir_bin}"
}

function install_homebrew() {
    output "\nInstalling the $vendor_name brew tap" "heading"
    if ! call_user "brew tap ${BREW_TAP}"; then
        output "  could not add tap to brew" "error"
        exit_with_error
    fi

    output "\nInstalling the $vendor_name CLI formula" "heading"

    # running on Rosetta2?
    arch=''
    if [ "$(uname -m)" = "x86_64" ]; then
        if [ "$(sysctl -in sysctl.proc_translated)" = "1" ]; then
            arch="arch -arm64"
        fi
    fi

    if ! call_user "$arch brew install ${BREW_FORMULA}"; then
        output "  could not install Formula" "error"
        exit_with_error
    fi
}

function install_yum() {
    output "\nSetting up the $vendor_name CLI yum repository" "heading"

    call_user "curl -1sLf 'https://dl.cloudsmith.io/public/platformsh/$cloudsmith_repository/setup.rpm.sh' > /tmp/setup.rpm.sh"

    if ! call_root "bash -E /tmp/setup.rpm.sh"; then
        output "  could not setup the RPM repository the CLI" "error"
        exit_with_error
    fi

    output "\nInstalling the $vendor_name CLI" "heading"

    if ! call_root "yum install -y $package"; then
        output "  could not install the CLI" "error"
        exit_with_error
    fi
}

function install_apt() {
    output "\nSetting up the $vendor_name CLI apt repository" "heading"

    call_user "curl -1sLf 'https://dl.cloudsmith.io/public/platformsh/$cloudsmith_repository/setup.deb.sh' > /tmp/setup.deb.sh"

    if ! call_root "bash -E /tmp/setup.deb.sh"; then
        output "  could not setup the APT repository the CLI" "error"
        exit_with_error
    fi

    output "\nInstalling the $vendor_name CLI" "heading"

    if ! call_root "apt-get install -y $package"; then
        output "  could not install the CLI" "error"
        exit_with_error
    fi
}

function install_apk() {
    output "\nSetting up the $vendor_name CLI apk repository" "heading"

    call_user "curl -1sLf 'https://dl.cloudsmith.io/public/platformsh/$cloudsmith_repository/setup.alpine.sh' > /tmp/setup.alpine.sh"

    if ! call_root "bash -E /tmp/setup.alpine.sh"; then
        output "  could not setup the APK repository the CLI" "error"
        exit_with_error
    fi

    output "\nInstalling the $vendor_name CLI" "heading"

    if ! call_root "apk add $package --update-cache"; then
        output "  could not install the CLI" "error"
        exit_with_error
    fi
}

function github_curl {
    if [ -z "${GITHUB_TOKEN}" ]; then
        curl -fsSL -H "Accept: application/vnd.github+json" $1
        return $?
    else
        curl -fsSL -H "Accept: application/vnd.github+json" -H "Authorization: Bearer ${GITHUB_TOKEN}" $1
        return $?
    fi
}

function is_ci {
    if [ ! -z "${CI}" ]; then # GitHub Actions, Travis CI, CircleCI, Cirrus CI, GitLab CI, AppVeyor, CodeShip, dsari
        return 0
    elif [ ! -z "${BUILD_NUMBER}" ]; then # Jenkins, TeamCity
        return 0
    elif [ ! -z "${RUN_ID}" ]; then # TaskCluster, dsari
        return 0
    else
        return 1
    fi
}

function install_raw() {
    # Start downloading the right version
    output "\nDownloading the $vendor_name CLI" "heading"

    url="${URL}/${version}/${binary}_${version}_${kernel}_${machine}.tar.gz"
    output "  Downloading ${url}";
    tmp_dir=$(mktemp -d)
    tmp_name="$binary-"$(date +"%s")
    if ! github_curl $url > "${tmp_dir}/${tmp_name}.tgz"; then
        output "  the download failed" "error"
        exit_with_error
    fi

    output "  Uncompressing archive"
    tar -C ${tmp_dir} -xzf "${tmp_dir}/${tmp_name}.tgz"

    output "  Making the binary executable"
    chmod 0755 "${tmp_dir}/$binary"

    if [ ! -d $dir_bin ]; then
        output "  Creating ${dir_bin} directory"
        call_try_user "mkdir -p ${dir_bin}" "Failed to create the ${dir_bin} directory"
    fi

    output "  Installing the binary under ${dir_bin}"
    call_try_user "mv '${tmp_dir}/$binary' '${dir_bin}/${binary}'" "Failed to move the binary ${binary}"
}

function install() {
    if [ "homebrew" = "${INSTALL_METHOD}" ]; then
       install_homebrew
    elif [ "yum" = "${INSTALL_METHOD}" ]; then
       install_yum
    elif [ "apt" = "${INSTALL_METHOD}" ]; then
       install_apt
    elif [ "apk" = "${INSTALL_METHOD}" ]; then
       install_apk
    elif [ "raw" = "${INSTALL_METHOD}" ]; then
       install_raw
    fi
}

intro
check_kernel
check_architecture
check_install_method
if [ "raw" = "${INSTALL_METHOD}" ]; then
    if [ -z "${VERSION}" ]; then
        check_curl
    fi
    check_version
    check_gzip
    check_shasum
    check_directories
elif [ "apt" = "${INSTALL_METHOD}" ] || [ "yum" = "${INSTALL_METHOD}" ] || [ "apk" = "${INSTALL_METHOD}" ]; then
    check_curl
fi
install
outro
