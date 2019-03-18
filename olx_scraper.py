#!/usr/bin/python
import urllib3
import json
from bs4 import BeautifulSoup

URL = 'http://www.olx.pl/nieruchomosci/mieszkania/sprzedaz/poznan/?search%5Bprivate_business%5D=private&search%5Bdist%5D=5'

def get_data(url):
    http = urllib3.PoolManager()
    retries = urllib3.util.Retry(read=3, backoff_factor=5,
                                 status_forcelist=frozenset([500,501,502,503,504,429]))
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.2 Safari/605.1.15'}
    http = urllib3.PoolManager(retries=retries, headers=headers)
    r = http.request_encode_url('GET', url)
    print('HTTP response: %s' % r.status)
    return r.data


def get_pages(url):
    pages_list = []
    pages_list.append(url)
    for x in range(100)[1:]:
        try:
            html_doc = get_data(url)
            soup = BeautifulSoup(html_doc, 'html.parser')
            pages = soup.find_all('span', {'class': 'fbold next abs large'})[0]
            href = pages.find_all('a', {'data-cy': 'page-link-next'}, href=True)[0]
            pages_list.append(href['href'])
            isworking = 1
        except:
            isworking = 0
        if isworking == 0:
            return pages_list
        else:
            print(href['href'])
            url = href['href']


def get_ad_url(pages_list):
    all_hrefs_olx = []
    all_hrefs_otodom = []
    total = 0
    for page in pages_list:
        print('-------------------------------------------------------------------------------------------------------')
        print(page)
        html_doc = BeautifulSoup(get_data(page), 'html.parser')
        #print(html_doc.prettify())
        offers_table = html_doc.find_all('table', {'id': 'offers_table'})[0]
        offers = offers_table.find_all('div', {'class': 'offer-wrapper'})
        #prices = offers.find_all('td', {'class': 'wwnormal tright td-price'})
        for offer in offers:
            total += 1
            isitpromoted = offer.find('a', {'class': 'marginright5 link linkWithHash detailsLinkPromoted'})
            if isitpromoted != None:
                ahref = offer.find('a', {'class': 'marginright5 link linkWithHash detailsLinkPromoted'})
                price = offer.find('p', {'class': 'price'}).text.strip('\n\rzł ')
                print('%s, %s' % (ahref['href'], price))
                if 'olx.pl' in ahref['href']:
                    all_hrefs_olx.append([ahref['href'], price])
                else:
                    all_hrefs_otodom.append([ahref['href'], price])
            else:
                ahref = offer.find('a', {'class': 'marginright5 link linkWithHash detailsLink'})
                price = offer.find('p', {'class': 'price'}).text.strip('\n\rzł ')
                print('%s, %s' % (ahref['href'], price))
                if 'olx.pl' in ahref['href']:
                    all_hrefs_olx.append([ahref['href'], price])
                else:
                    all_hrefs_otodom.append([ahref['href'], price])
    print_to_file_json(all_hrefs_olx, 'olx')
    print_to_file_json(all_hrefs_otodom, 'otodom')
    print('OLX ads: %s, OTODOM ads: %s, TOTAL: %s' % (len(all_hrefs_olx), len(all_hrefs_otodom), total))


def print_to_file_csv(hrefs_list):
    with open('olx_urls.csv', 'w') as f:
        for item in hrefs_list:
            f.write("%s,%s\n" % (item[0], item[1]))

def print_to_file_json(hrefs_list,urlsname):
    jsonfile = [{"url": item[0], "price": item[1]} for item in hrefs_list]
    with open('%s_urls.json' % urlsname, 'w') as f:
        json.dump(jsonfile, f, indent=3)


pages_list = get_pages(URL)
get_ad_url(pages_list)
