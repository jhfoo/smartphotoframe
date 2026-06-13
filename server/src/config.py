import yaml

FILE_CONFIG = 'conf/app.yaml'


class Default:
  def __init__(self, config=None):
    if config is None:
      config = {}
    self._config = config

  @property
  def AlbumId(self):
    return self._config.get('AlbumId', None)

  @AlbumId.setter
  def AlbumId(self, value):
    self._config['AlbumId'] = value

  @property
  def AlbumName(self):
    return self._config.get('AlbumName', None)

  @AlbumName.setter
  def AlbumName(self, value):
    self._config['AlbumName'] = value


class Config:
  f = open(FILE_CONFIG, 'r')
  _config = yaml.safe_load(f)
  f.close()
  if _config is None:
    _config = {}

  if not 'default' in _config:
    _config['default'] = {}
  default = Default(_config['default'])

  @classmethod
  def save(cls):
    with open(FILE_CONFIG, 'w') as outfile:
      yaml.safe_dump(cls._config, outfile)
