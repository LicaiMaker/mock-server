# coding=utf-8
import paramiko
import os
import hashlib
import time

# transport = paramiko.Transport(('192.168.1.96', 22))

# transport.connect(username='morra', password='357447218')

# sftp = paramiko.SFTPClient.from_transport(transport)

# sftp.put('123.py', '/tmp/test.py')  # 将123.py 上传至服务器 /tmp下并改名为test.py

# sftp.get('remove_path', 'local_path')  # 将remove_path 下载到本地 local_path

# transport.close()


# ---- 配置文件 ----

config = {}
config['hide'] = [
    'node_modules'
]
config['root'] = "."
config['ssh_host'] = "81.68.100.80"
config['ssh_user'] = "root"
config['ssh_pass'] = "licaiMaker800@"
config['ssh_port'] = 22
config['ssh_remotepath'] = "/home/"

# ---- 配置结束 ----

_cache_hash = {}
_is_init = True

_create_file_list = []
_modify_file_list = []
_delete_file_list = []


class Sftp:
    # transport

    # webpath = ""
    # host = ""
    # username = ""
    # password = ""
    # port = 22
    def __init__(self, host, port=22, username="", password=""):
        self.host = host
        self.username = username
        self.password = password
        self.port = port

    def connect(self):
        self.transport = paramiko.Transport((self.host, self.port))
        self.transport.connect(username=self.username, password=self.password)

    def upload(self, filepath, remotepath):
        sftp = paramiko.SFTPClient.from_transport(self.transport)
        sftp.put(filepath, remotepath)

    def mkdir(self, dirname):
        stdin, stdout, stderr = self.transport.exec_command('mkdir ' + dirname)
        # 获取命令结果 
        result = stdout.read()

        def command(self, command):
            stdin, stdout, stderr = self.transport.exec_command(command)
            # 获取命令结果

        result = stdout.read()
        return result


def close(self):
    self.transport.close()


# def sftp():
#     transport = paramiko.Transport(('192.168.1.96', 22))
#     transport.connect(username='morra', password='357447218')
#     sftp = paramiko.SFTPClient.from_transport(transport)
#     sftp.put('123.py', '/tmp/test.py')  # 将123.py 上传至服务器 /tmp下并改名为test.py
#     sftp.get('remove_path', 'local_path')  # 将remove_path 下载到本地 local_path
#     transport.close()


# 生成MD5
def md5(str):
    m2 = hashlib.md5()
    m2.update(str.encode('utf8'))
    return m2.hexdigest()


# 获取文件的创建时间
def get_FileCreateTime(filePath):
    # filePath = unicode(filePath,'utf8')
    t = os.path.getctime(filePath)
    return t


# 获取文件的修改时间
def get_FileModifyTime(filePath):
    # filePath = unicode(filePath,'utf8')
    t = os.path.getmtime(filePath)
    return t


# 判断文件是否发生变动
def has_change(filepath):
    return false


def is_hidden(filename):
    if (filename.startswith('.')):
        return True
    if (filename in config['hide']):
        return True
    return False


def clear_list():
    # print("清空列表")
    del _modify_file_list[:]
    del _create_file_list[:]
    del _delete_file_list[:]


def list_dir(root):
    for filename in os.listdir(root):
        pathname = os.path.join(root, filename)
        filehash = md5(pathname)  # 文件的hash值
        create_time = get_FileCreateTime(pathname)  # 文件创建时间
        modify_time = get_FileModifyTime(pathname)  # 文件修改时间

        isfile = os.path.isfile(pathname)
        # 判断是否隐藏的文件
        if (False == is_hidden(filename)):
            if (False == isfile):
                list_dir(pathname)
            else:
                # print(pathname)
                # 是否已经缓存
                if (filehash in _cache_hash):  # 有缓存
                    # 文件发生了改变
                    if (_cache_hash[filehash]["modify_time"] != modify_time):
                        if (False == isfile):
                            list_dir(pathname)
                        else:
                            _modify_file_list.append(pathname)
                        _cache_hash[filehash]["modify_time"] = modify_time
                else:  # 没有缓存 初始化
                    # print('debug')
                    _cache_hash[filehash] = {"create_time": create_time, "modify_time": modify_time, "path": pathname}
                    _create_file_list.append(pathname)


# 初始化
print("初始化...")
list_dir(config['root'])

# 清空列表 初始化的数据不记录
clear_list()

print("连接SFTP...")
# 实例化SFTP
sftp = Sftp(config['ssh_host'], config['ssh_port'], config['ssh_user'], config['ssh_pass'])

# 开始连接SFTP
sftp.connect()


def upload(file_list):
    for filename in file_list:
        filename = filename.replace("\\", "/")
        remote = config['ssh_remotepath'] + filename.replace(config['root'], "", 1)
        print((time.strftime('%H:%M:%S', time.localtime(time.time())) + ':' + filename.replace(config['root'], "",
                                                                                               1)).ljust(50, ' '),
              'end'+'')
        print('[upload]'.rjust(20, ' '), 'end'+'')
        sftp.upload(filename, remote)
        print('\b' * 20, 'end'+'')
        print('[ok]'.rjust(20, ' '))


print("开始监控文件...")
while (True):
    # else: 
    #     print("监听：")

    # 遍历文件目录
    list_dir(config['root'])

    # 获取对应修改的文件

    # 新建的文件
    if (len(_create_file_list) > 0):
        # 开始上传
        upload(_create_file_list)

    # 修改的文件
    if (len(_modify_file_list) > 0):
        # 开始上传
        # print("d")
        upload(_modify_file_list)

    # 删除的文件
    for filename in _delete_file_list:
        print(filename + ' 删除')

    # 清空记录 准备下一轮
    clear_list()
    time.sleep(1) 